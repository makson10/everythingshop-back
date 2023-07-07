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
const baseFileFolderPath = process.cwd() + '/temporarilyFiles/';

// -----------------------------------------------------

productsRouter.get('/getPhotoAccessKey', async (req, res) => {
    const photoAccessKey = await getPhotoAccessToken();
    res.status(200).json({ token: photoAccessKey.token });
});

// -----------------------------------------------------

const getAllProducts = async (req, res, next) => {
    const allProducts = await db.getAllProducts();

    req.body.allProducts = allProducts;
    next();
};

const parseCommentsAndPhotoIds = async (req, res, next) => {
    const { allProducts } = req.body;

    const allProductsWithParsedData = allProducts.map((product) => {
        const productWithParsedData = { ...product };

        productWithParsedData.comments = JSON.parse(product.comments);
        productWithParsedData.photo_id = JSON.parse(product.photo_id);

        return productWithParsedData;
    });

    req.body.allProductsWithParsedData = allProductsWithParsedData;
    next();
};

const sendResponse = async (req, res, next) => {
    const { allProductsWithParsedData: products } = req.body;
    res.status(200).json(products);
};

productsRouter.get('/', [getAllProducts, parseCommentsAndPhotoIds, sendResponse]);

// -----------------------------------------------------

const getProductData = async (req, res, next) => {
    const { productId } = req.params;

    const [product] = await db.getProduct(productId);
    if (!product) {
        res.status(404).json({ success: false, errorMessage: 'Product with this uniqueProductId not found!' });
    } else {
        product.photo_id = JSON.parse(product.photo_id);
        req.body.product = product;
        next();
    }
};

const sendProductDataResponse = async (req, res, next) => {
    const { product } = req.body;
    product.comments = JSON.parse(product.comments);

    res.status(200).json(product);
};

productsRouter.get('/:productId', [getProductData, sendProductDataResponse]);

// -----------------------------------------------------

productsRouter.get('/doesProductExist/:productId', async (req, res) => {
    const { productId } = req.params;

    const allProducts = await db.getAllProducts();
    const doesProductExist = allProducts.some(product => product.uniqueProductId === productId);

    res.status(200).json(doesProductExist);
});

// -----------------------------------------------------

const validateProductData = (req, res, next) => {
    const photoFiles = req.files;
    const { title, description, creator, price, uniqueProductId, comments } = req.body;

    if (!photoFiles.length || !title || !description || !creator || !price || !uniqueProductId || !comments) {
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
                baseFileFolderPath + fileName,
                new Uint8Array(Buffer.from(file.buffer)),
            );

            localFileNames.push(fileName);
        })
    );

    req.body.localFileNames = localFileNames;
    next();
};

const storeFilesInGoogleDrive = async (req, res, next) => {
    const { localFileNames } = req.body;
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
    const { localFileNames } = req.body;

    await Promise.all(
        localFileNames.map(async (fileName) => {
            await fs.unlink(baseFileFolderPath + fileName);
        })
    );

    next();
};

const saveProductData = async (req, res, next) => {
    const productData = req.body;
    productData.photoFilesId = JSON.stringify(productData.googleDrivePhotoIds);

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

const deleteProductPhotoFiles = async (req, res, next) => {
    const { photo_id: photoIds } = req.body.product;

    await Promise.all(
        photoIds.map(async (photoId) => {
            await deleteFile(photoId);
        })
    );

    next();
};

const deleteProductData = async (req, res, next) => {
    const { productId } = req.params;

    await db.deleteProduct(productId);
    res.status(200).json({ success: true });
};

productsRouter.delete(
    '/deleteProduct/:productId',
    [
        getProductData,
        deleteProductPhotoFiles,
        deleteProductData,
    ]
);

// -----------------------------------------------------

const validateNewCommentData = async (req, res, next) => {
    const { author, date, picture, text, uniqueCommentId } = req.body;

    if (!author || !date || !picture || !text || !uniqueCommentId) {
        res.status(404).json({ error: 'New comment data is not valid!' });
    } else next();
};

const getOldComments = async (req, res, next) => {
    const { product: { comments: rawOldComments } } = req.body;

    const oldComments = await JSON.parse(rawOldComments);
    req.body.oldComments = oldComments;
    next();
};

const addNewComment = async (req, res, next) => {
    const { oldComments, author, date, picture, text, uniqueCommentId } = req.body;
    const newComment = {
        author: author,
        date: date,
        picture: picture,
        text: text,
        uniqueCommentId: uniqueCommentId,
    };

    const newComments = [...oldComments, newComment];
    req.body.newComments = newComments;

    next();
};

const updateComments = async (req, res, next) => {
    const { productId } = req.params;
    const { newComments } = req.body;
    const newCommentsInJSON = JSON.stringify(newComments);

    await db.updateProductComments(productId, newCommentsInJSON);
    res.status(200).json({ success: true });
};

productsRouter.post(
    '/addComment/:productId',
    [
        validateNewCommentData,
        getProductData,
        getOldComments,
        addNewComment,
        updateComments
    ]
);

// -----------------------------------------------------

const checkIsThisCommentExist = async (req, res, next) => {
    const { commentId } = req.params;
    const { oldComments } = req.body;

    const isCommentExist = oldComments.some((comment) => comment.uniqueCommentId === commentId);

    if (!isCommentExist) {
        res.status(404).json({ error: 'Comment with this uniqueCommentId not found!' });
    } else next();
};

const removeComments = async (req, res, next) => {
    const { commentId } = req.params;
    const { oldComments } = req.body;

    const commentForDeleteIndex = oldComments.findIndex(comment => comment.uniqueCommentId === commentId);

    const newComments = [...oldComments];
    newComments.splice(commentForDeleteIndex, 1);

    req.body.newComments = newComments;
    next();
};


productsRouter.delete(
    '/deleteComment/:productId/:commentId',
    [
        getProductData,
        getOldComments,
        checkIsThisCommentExist,
        removeComments,
        updateComments,
    ]
);


module.exports = productsRouter;