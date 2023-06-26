const dbx = require('../dropboxClient');
const multer = require('multer');
const db = require("../sqlite");
const express = require('express');
const productsRouter = express.Router();

// -----------------------------------------------------

const getAllProducts = async (req, res, next) => {
    const allProducts = await db.getAllProducts();
    req.body.allProducts = allProducts;
    next();
};

const parseComments = async (req, res, next) => {
    const allProducts = req.body.allProducts;

    const allProductsWithParsedComments = allProducts.map((product) => {
        const productWithParsedComments = { ...product };
        productWithParsedComments.comments = JSON.parse(product.comments);

        return productWithParsedComments;
    });

    req.body.allProductsWithParsedComments = allProductsWithParsedComments;
    next();
};

const parsePhotoIds = async (req, res, next) => {
    const allProducts = req.body.allProductsWithParsedComments;

    const allProductsWithParsedPhotoIds = allProducts.map((product) => {
        const productWithParsedPhotoIds = { ...product };
        productWithParsedPhotoIds.photo_id = JSON.parse(product.photo_id);

        return productWithParsedPhotoIds;
    });

    req.body.allProductsWithParsedPhotoIds = allProductsWithParsedPhotoIds;
    next();
};

const sendResponse = async (req, res, next) => {
    const products = req.body.allProductsWithParsedPhotoIds;
    res.status(200).send(products);
};

productsRouter.get('/', [getAllProducts, parseComments, parsePhotoIds, sendResponse]);

// -----------------------------------------------------

productsRouter.get('/:productId', async (req, res) => {
    const productId = req.params.productId;

    const allProducts = await db.getAllProducts();
    const product = allProducts.find(product => product.uniqueProductId === productId);

    if (!product) {
        res.status(418).json({ error: 'No product with this uniqueProductId already exists' })
    }

    product.comments = JSON.parse(product.comments);
    product.photo_id = JSON.parse(product.photo_id);
    res.status(200).send(product);
});

// -----------------------------------------------------

productsRouter.get('/doesProductExist/:productId', async (req, res) => {
    const productId = req.params.productId;

    const allProducts = await db.getAllProducts();
    const doesProductExist = allProducts.some(product => product.uniqueProductId === productId);

    res.status(200).send(doesProductExist);
});

// -----------------------------------------------------

const validateProductData = (req, res, next) => {
    const productData = req.body;
    const photoFile = req.files;
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
    const photoFiles = req.files;
    const uniqueProductId = req.body.uniqueProductId;
    const photoIds = [];

    photoFiles.map((photoFile, index) => {
        const fileName = `${uniqueProductId}_${index}.png`;

        dbx.filesUpload({ path: '/' + fileName, contents: photoFile.buffer })
            .then(res => console.log(res))
            .catch(err => {
                console.log(err);
                res.status(404).json({ error: 'Error occured' });
            });

        photoIds.push(fileName);
    });

    req.body.photoIds = photoIds;
    next();
};

const saveProductData = async (req, res, next) => {
    const productData = req.body;
    const photoIds = req.body.photoIds;
    productData.photoFilesId = JSON.stringify(photoIds);

    try {
        await db.addNewProduct(productData);
        res.status(200).json({ success: true });
    } catch (error) {
        res.staus(404).json({ success: false, errorMessage: 'Something went wrong' });
    }
}

productsRouter.post('/addNewProduct', multer().array('file'), [validateProductData, savePhotoFile, saveProductData]);

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
        product.photo_id = JSON.parse(product.photo_id);
        req.body.product = product;
        next();
    }
};

const deleteProductPhotoFile = async (req, res, next) => {
    const product = req.body.product;
    const productPhotoURLs = product.photo_id;

    productPhotoURLs.map(async (photoURL) => {
        await dbx.filesDeleteV2({ path: '/' + photoURL });
    });

    next();
};

const deleteProductData = async (req, res, next) => {
    const productId = req.params.productId;

    await db.deleteProduct(productId);
    res.status(200).json({ success: true });
};

productsRouter.delete('/deleteProduct/:productId', [validateDeleteProductData, getProductData, deleteProductPhotoFile, deleteProductData]);

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


productsRouter.delete('/deleteComment/:productId/:commentId', [findCorrespondingProduct, getOldComments, checkIsThisCommentExist, removeComments, updateComments]);


module.exports = productsRouter;