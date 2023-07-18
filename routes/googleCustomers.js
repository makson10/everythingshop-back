const express = require('express');
const googleCustomersRouter = express.Router();
const db = require("../db");
const jwt = require('jsonwebtoken');
const JWT_ENCODE_KEY = process.env.JWT_ENCODE_KEY;

// -----------------------------------------------------

googleCustomersRouter.get('/', async (req, res) => {
    const allGoogleCustomers = await db.getAllGoogleCustomers();
    res.status(200).json(allGoogleCustomers);
});

// -----------------------------------------------------

const validateRegisterGoogleUserData = (req, res, next) => {
    const { id, name, email, picture } = req.body;

    if (!id || !name || !email || !picture) {
        res.status(404).json({ error: 'User data is not valid!' });
    } else next();
}

const checkIsGoogleUserExist = async (req, res, next) => {
    const { email } = req.body;

    const allGoogleCustomers = await db.getAllGoogleCustomers();
    const isUserExist = allGoogleCustomers.some((customer) => customer.email === email);

    if (isUserExist) {
        res.status(404).json({ error: 'User with this email already exists' });
    } else next();
}

const saveGoogleUserData = async (req, res, next) => {
    await db.addNewGoogleCustomer(req.body);
    next();
}

const generateJWTToken = async (req, res, next) => {
    const token = jwt.sign(req.body, JWT_ENCODE_KEY);
    res.status(200).json({ jwtToken: token });
}

googleCustomersRouter.post(
    '/register',
    [
        validateRegisterGoogleUserData,
        checkIsGoogleUserExist,
        saveGoogleUserData,
        generateJWTToken,
    ]
);

// -----------------------------------------------------

const validateJWTToken = async (req, res, next) => {
    const { jwtToken } = req.body;

    if (!jwtToken) {
        res.status(404).json({ error: 'JWT token is not valid!' });
    } else next();
}

const verifyGoogleUserByJWTToken = async (req, res, next) => {
    const { jwtToken } = req.body;
    const googleUserData = jwt.verify(jwtToken, JWT_ENCODE_KEY);

    res.status(200).json(googleUserData);
}

googleCustomersRouter.post('/verify', [validateJWTToken, verifyGoogleUserByJWTToken]);

// -----------------------------------------------------

const validateLoginGoogleUserData = async (req, res, next) => {
    const { id } = req.body;

    if (!id) {
        res.status(404).json({ error: 'Id is not valid!' });
    } else next();
}

const getGoogleUserData = async (req, res, next) => {
    const { id } = req.body;

    const allGoogleCustomers = await db.getAllGoogleCustomers();
    const googleUserData = allGoogleCustomers.find((googleCustomer) => googleCustomer.id === id);

    if (!googleUserData) {
        return res.status(404).json({ error: 'User with this data is not exist!' });
    }

    req.body.googleUserData = googleUserData;
    next();
}

const generateJWTAndSendResponse = async (req, res, next) => {
    const { googleUserData } = req.body;

    const token = jwt.sign(googleUserData, JWT_ENCODE_KEY);
    res.status(200).json({ jwtToken: token });
};

googleCustomersRouter.post('/login', [validateLoginGoogleUserData, getGoogleUserData, generateJWTAndSendResponse]);


module.exports = googleCustomersRouter;