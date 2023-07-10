const express = require('express');
const productsRouter = express.Router();
const db = require("../sqlite");
const { getPhotoAccessToken } = require('../googleDriveClient');

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
        productWithParsedData.photoIds = JSON.parse(product.photoIds);

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
        product.photoIds = JSON.parse(product.photoIds);
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


module.exports = productsRouter;