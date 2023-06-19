const BoxSDK = require('box-node-sdk');
const multer = require('multer');

const db = require("../sqlite");
const express = require('express');
const productsRouter = express.Router();

const sdk = new BoxSDK({
    clientID: process.env.BOX_CLIENT_ID,
    clientSecret: process.env.BOX_CLIENT_SECRET,
});

const client = sdk.getBasicClient(process.env.BOX_DEVELOPER_TOKEN);

// -----------------------------------------------------

productsRouter.get('/', async (req, res) => {
    const allProducts = await db.getAllProducts();
    res.status(200).send(allProducts);
});

// -----------------------------------------------------

productsRouter.get('/:productId', async (req, res) => {
    const productId = req.params.productId;

    const allProducts = await db.getAllProducts();
    const product = allProducts.find(product => product.uniqueProductId === productId);

    if (!product) {
        res.status(418).json({ error: 'No product with this uniqueProductId already exists' })
    }

    res.status(200).send(product);
});

// -----------------------------------------------------

const validateProductData = (req, res, next) => {
    const productData = req.body;
    const photoFile = req.file;
    const title = productData.title;
    const description = productData.description;
    const creator = productData.creator;
    const price = productData.price;
    const uniqueProductId = productData.uniqueProductId;
    const comments = productData.comments;

    if (!photoFile || !title || !description || !creator || !price || !uniqueProductId || !comments) {
        res.status(404).json({ error: 'Product data is not valid!' });
    } else next();
}

const savePhotoFile = async (req, res, next) => {
    const photoFile = req.file;
    const uniqueProductId = req.body.uniqueProductId;
    console.log(photoFile);
    console.log(uniqueProductId);

    await client.files.uploadFile('0', `${uniqueProductId}.png`, photoFile.buffer).then(file => {
        req.body.photoFileId = file.entries[0].id;
        next();
    });
};

const saveProductData = async (req, res, next) => {
    const productData = req.body;

    try {
        await db.addNewProduct(productData);
        res.status(200).json({ success: true });
    } catch (error) {
        res.staus(404).json({ success: false, errorMessage: 'Something went wrong' });
    }
}

productsRouter.post('/addNewProduct', multer().single('file'), [validateProductData, savePhotoFile, saveProductData]);

// -----------------------------------------------------

const validateDeleteProductData = async (req, res, next) => {
    const productId = req.params.productId;

    if (!productId) {
        res.status(404).json({ success: false, errorMessage: 'Product id is not valid!' });
    } else next();
};

const getProductData = async (req, res, next) => {
    const productId = req.params.productId;

    const [product] = await db.getProduct(productId);
    if (!product) {
        res.status(404).json({ success: false, errorMessage: 'Product with this uniqueProductId not found!' });
    } else {
        const productPhotoFileId = await product.photo_id;
        req.body.productPhotoFileId = productPhotoFileId;

        next();
    }
};

const deleteProductData = async (req, res, next) => {
    const productId = req.params.productId;
    const productPhotoFileId = req.body.productPhotoFileId;

    client.files.delete(productPhotoFileId)
        .catch(err => {
            if (err.statusCode === 412) {
                console.log(err);
            }
        });

    await db.deleteProduct(productId);
    res.status(200).json({ success: true });
};

productsRouter.delete('/deleteProduct/:productId', [validateDeleteProductData, getProductData, deleteProductData]);

// -----------------------------------------------------

const validateNewCommentData = async (req, res, next) => {
    const productId = req.params.productId;

    const commentData = req.body;
    const name = commentData.name;
    const date = commentData.date;
    const picture = commentData.picture;
    const text = commentData.text;
    const uniqueCommentId = commentData.uniqueCommentId;

    if (!productId || !name || !date || !picture || !text || !uniqueCommentId) {
        return res.status(404).json({ error: 'New comment data is not valid!' });
    } else next();
};

const findCorrespondingProduct = async (req, res, next) => {
    const productId = req.params.productId;

    const [product] = await db.getProduct(productId);
    if (!product) {
        res.status(404).json({ success: true, errorMessage: 'Product with this uniqueProductId not found!' });
    } else {
        req.body.product = product;
        next();
    }
};

const getOldComments = async (req, res, next) => {
    const product = req.body.product;

    const rawOldComments = await product.comments;
    const oldComments = await JSON.parse(rawOldComments);
    req.body.oldComments = oldComments;

    next();
};

const addNewComment = async (req, res, next) => {
    const oldComments = req.body.oldComments;
    const newComment = {
        name: req.body.name,
        date: req.body.date,
        picture: req.body.picture,
        text: req.body.text,
        uniqueCommentId: req.body.uniqueCommentId,
    };

    const newComments = [...oldComments, newComment];
    req.body.newComments = newComments;

    next();
};

const updateComments = async (req, res, next) => {
    const productId = req.params.productId;
    const newComments = req.body.newComments;
    const newCommentsInJSON = JSON.stringify(newComments);

    await db.updateProductComments(productId, newCommentsInJSON);

    res.status(200).json({ success: true });
};

productsRouter.post('/addComment/:productId', [validateNewCommentData, findCorrespondingProduct, getOldComments, addNewComment, updateComments]);

// -----------------------------------------------------

const checkIsThisCommentExist = async (req, res, next) => {
    const commentId = req.params.commentId;
    const oldComments = req.body.oldComments;

    const isCommentExist = oldComments.some((comment) => comment.uniqueCommentId === commentId);

    if (!isCommentExist) {
        res.status(404).json({ error: 'Comment with this uniqueCommentId not found!' });
    } else next();
};

const removeComments = async (req, res, next) => {
    const commentId = req.params.commentId;
    const oldComments = req.body.oldComments;

    const commentForDeleteIndex = oldComments.findIndex(comment => comment.uniqueCommentId === commentId);

    const newComments = [...oldComments];
    newComments.splice(commentForDeleteIndex, 1);

    req.body.newComments = newComments;
    next();
};


productsRouter.post('/deleteComment/:productId/:commentId', [findCorrespondingProduct, getOldComments, checkIsThisCommentExist, removeComments, updateComments]);



module.exports = productsRouter;