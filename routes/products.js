const express = require('express');
const productsRouter = express.Router();
const db = require("../db");
const { getPhotoAccessToken } = require('../googleDriveClient');

// -----------------------------------------------------

productsRouter.get('/getPhotoAccessKey', async (req, res) => {
    const photoAccessKey = await getPhotoAccessToken();
    res.status(200).json({ token: photoAccessKey.token });
});

// -----------------------------------------------------

const getAllProducts = async (req, res, next) => {
    const allProducts = await db.getAllProducts();

    req.body.data = allProducts;
    next();
};

const sendResponse = async (req, res, next) => {
    const { data } = req.body;
    res.status(200).json(data);
};

productsRouter.get('/', [getAllProducts, sendResponse]);

// -----------------------------------------------------

const getProductData = async (req, res, next) => {
    const { productId } = req.params;

    const [product] = await db.getProduct(productId);
    if (!product) {
        res.status(404).json({ success: false, errorMessage: 'Product with this uniqueProductId not found!' });
    } else {
        req.body.data = product;
        next();
    }
};

productsRouter.get('/:productId', [getProductData, sendResponse]);

// -----------------------------------------------------

productsRouter.get('/doesProductExist/:productId', async (req, res) => {
    const { productId } = req.params;

    const doesProductExist = await db.doesProductExist(productId);
    res.json(doesProductExist);
});


module.exports = productsRouter;