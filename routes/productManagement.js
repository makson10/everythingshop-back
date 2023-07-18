const express = require('express');
const productManagementRouter = express.Router();
const db = require("../db");
const { deleteFile } = require('../googleDriveClient');

// -----------------------------------------------------

const validateProductData = (req, res, next) => {
    const { photoIds, title, description, creator, price, uniqueProductId, comments } = req.body;

    if (!photoIds.length || !title || !description || !creator || !price || !uniqueProductId || !comments) {
        res.status(404).json({ error: 'Product data is not valid!' });
    } else next();
}

const parseFormData = (req, res, next) => {
    req.body.price = +req.body.price;
    req.body.comments = JSON.parse(req.body.comments);
    next();
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

productManagementRouter.post(
    '/addNewProduct',
    [
        validateProductData,
        parseFormData,
        saveProductData,
    ]
);

// -----------------------------------------------------

const getProductData = async (req, res, next) => {
    const { productId } = req.params;

    const [product] = await db.getProduct(productId);
    if (!product) {
        res.status(404).json({ success: false, errorMessage: 'Product with this uniqueProductId not found!' });
    } else {
        req.body.product = product;
        next();
    }
};

const deleteProductPhotoFiles = async (req, res, next) => {
    const { photoIds } = req.body.product;

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

productManagementRouter.delete(
    '/deleteProduct/:productId',
    [
        getProductData,
        deleteProductPhotoFiles,
        deleteProductData,
    ]
);


module.exports = productManagementRouter;