const express = require('express');
const customersRouter = express.Router();
const db = require("../sqlite");
const jwt = require('jsonwebtoken');
const JWT_ENCODE_KEY = process.env.JWT_ENCODE_KEY;

// -----------------------------------------------------

customersRouter.get('/', async (req, res) => {
    const allCustomers = await db.getAllCustomers();
    res.status(200).json(allCustomers);
});

// -----------------------------------------------------

const validateRegisterUserData = (req, res, next) => {
    const { name, dateOfBirth, email, login, password } = req.body;

    if (!name || !dateOfBirth || !email || !login || !password) {
        res.status(404).json({ error: 'User data is not valid!' });
    } else next();
}

const checkIsUserExist = async (req, res, next) => {
    const { email, login } = req.body;

    const allCustomers = await db.getAllCustomers();
    const isUserExist = allCustomers.some((customer) => customer.email === email && customer.login === login);

    if (isUserExist) {
        res.status(404).json({ error: 'User with this email or login already exists' });
    } else next();
}

const saveUserData = async (req, res, next) => {
    await db.addNewCustomer(req.body);
    next();
}

const generateJWTToken = async (req, res, next) => {
    const token = jwt.sign(req.body, JWT_ENCODE_KEY);
    res.status(200).json({ jwtToken: token });
}

customersRouter.post(
    '/register',
    [
        validateRegisterUserData,
        checkIsUserExist,
        saveUserData,
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

const verifyUserByJWTToken = async (req, res, next) => {
    const { jwtToken } = req.body;
    const userData = jwt.verify(jwtToken, JWT_ENCODE_KEY);

    res.status(200).json(userData);
}

customersRouter.post('/verify', [validateJWTToken, verifyUserByJWTToken]);

// -----------------------------------------------------

const validateLoginUserData = async (req, res, next) => {
    const { login, password } = req.body;

    if (!login || !password) {
        res.status(404).json({ error: 'Login or password is not valid!' });
    } else next();
}

const getUserData = async (req, res, next) => {
    const { login, password } = req.body;

    const allCustomers = await db.getAllCustomers();
    const userData = await allCustomers.find((customer) => customer.login === login && customer.password === password);

    if (!userData) {
        return res.status(404).json({ error: 'User with this credential is not exist!' });
    }

    req.body.userData = userData;
    next();
}

const generateJWTAndSendResponse = async (req, res, next) => {
    const { userData } = req.body;

    const token = jwt.sign(userData, JWT_ENCODE_KEY);
    res.status(200).json({ jwtToken: token });
};

customersRouter.post('/login', [validateLoginUserData, getUserData, generateJWTAndSendResponse]);


module.exports = customersRouter;