const express = require('express');
const productManagementRouter = express.Router();
const multer = require('multer');
const db = require("../sqlite");
const { uploadFile, deleteFile } = require('../googleDriveClient');
const fs = require('fs').promises;
const baseFileFolderPath = process.cwd() + '/temporarilyFiles/';

// -----------------------------------------------------

const validateProductData = (req, res, next) => {
    const photoFiles = req.files;
    const { title, description, creator, price, uniqueProductId, comments } = req.body;

    if (!photoFiles.length || !title || !description || !creator || !price || !uniqueProductId || !comments) {
        res.status(404).json({ error: 'Product data is not valid!' });
    } else next();
}

const storePhotos = async (req, res, next) => {
    const photoFiles = req.files;

    const googlePhotoIdPromises = photoFiles.map(async photoFile => {
        const localFileName = await saveFilesLocaly(photoFile);
        const googlePhotoId = await storeFilesInGoogleDrive(localFileName);
        await deleteLocalFiles(localFileName);
        return googlePhotoId;
    });

    const googlePhotoIds = await Promise.all(googlePhotoIdPromises).then(res => res);

    req.body.googlePhotoIds = googlePhotoIds;
    next();
};

const saveFilesLocaly = async (file) => {
    const fileName = file.originalname;

    await fs.writeFile(
        baseFileFolderPath + fileName,
        new Uint8Array(Buffer.from(file.buffer))
    );

    return fileName;
};

const storeFilesInGoogleDrive = async (localFileName) => {
    const fileId = await uploadFile(localFileName);
    return fileId;
};

const deleteLocalFiles = async (localFileName) => {
    await fs.unlink(baseFileFolderPath + localFileName);
};

const saveProductData = async (req, res, next) => {
    const productData = req.body;
    productData.photoFilesId = JSON.stringify(productData.googlePhotoIds);

    try {
        await db.addNewProduct(productData);
        res.status(200).json({ success: true });
    } catch (error) {
        res.staus(404).json({ success: false, errorMessage: 'Something went wrong' });
    }
}

productManagementRouter.post(
    '/addNewProduct',
    multer().array('file'),
    [
        validateProductData,
        storePhotos,
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
        product.photoIds = JSON.parse(product.photoIds);
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