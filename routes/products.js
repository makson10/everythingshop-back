const express = require('express');
const productsRouter = express.Router();
const multer = require('multer');
const db = require("../sqlite");
const {
    getPhotoAccessToken,
    uploadFile,
    deleteFile,
} = require('../googleDriveClient');
const fs = require('fs').promises;

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

productsRouter.get('/getPhotoAccessKey', async (req, res) => {
    const photoAccessKey = await getPhotoAccessToken();
    res.status(200).json({ token: photoAccessKey.token });
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

const saveFilesLocaly = async (req, res, next) => {
    const photoFiles = req.files;
    const localFileNames = [];

    await Promise.all(
        photoFiles.map(async (file) => {
            const fileName = file.originalname;

            await fs.writeFile(
                process.cwd() + '/temporarilyFiles/' + fileName,
                new Uint8Array(Buffer.from(file.buffer)),
            );

            localFileNames.push(fileName);
        })
    );

    req.body.localFileNames = localFileNames;
    next();
};

const storeFilesInGoogleDrive = async (req, res, next) => {
    const localFileNames = req.body.localFileNames;
    const googleDrivePhotoIds = [];

    await Promise.all(
        localFileNames.map(async (fileName) => {
            const fileId = await uploadFile(fileName);
            googleDrivePhotoIds.push(fileId);
        })
    );

    req.body.googleDrivePhotoIds = googleDrivePhotoIds;
    next();
};

const deleteLocalFiles = async (req, res, next) => {
    const localFileNames = req.body.localFileNames;

    await Promise.all(
        localFileNames.map(async (fileName) => {
            await fs.unlink(process.cwd() + '/temporarilyFiles/' + fileName);
        })
    );

    next();
};

const saveProductData = async (req, res, next) => {
    const productData = req.body;
    const googleDrivePhotoIds = req.body.googleDrivePhotoIds;
    productData.photoFilesId = JSON.stringify(googleDrivePhotoIds);

    try {
        await db.addNewProduct(productData);
        res.status(200).json({ success: true });
    } catch (error) {
        res.staus(404).json({ success: false, errorMessage: 'Something went wrong' });
    }
}

productsRouter.post(
    '/addNewProduct',
    multer().array('file'),
    [
        validateProductData,
        saveFilesLocaly,
        storeFilesInGoogleDrive,
        deleteLocalFiles,
        saveProductData,
    ]
);

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

const deleteProductPhotoFiles = async (req, res, next) => {
    const product = req.body.product;
    const photoIds = product.photo_id;

    await Promise.all(
        photoIds.map(async (photoId) => {
            await deleteFile(photoId);
        })
    );

    next();
};

const deleteProductData = async (req, res, next) => {
    const productId = req.params.productId;

    await db.deleteProduct(productId);
    res.status(200).json({ success: true });
};

productsRouter.delete('/deleteProduct/:productId', [validateDeleteProductData, getProductData, deleteProductPhotoFiles, deleteProductData]);

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