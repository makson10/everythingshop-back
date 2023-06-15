const jwt = require('jsonwebtoken');
const db = require("../sqlite");
const express = require('express');
const customersRouter = express.Router();

// -----------------------------------------------------

customersRouter.get('/', async (req, res) => {
    const allCustomers = await db.getAllCustomers();
    res.status(200).send(allCustomers);
});

// -----------------------------------------------------

const validateRegisterUserData = (req, res, next) => {
    const userData = req.body;
    const name = userData.name;
    const dateOfBirth = userData.dateOfBirth;
    const email = userData.email;
    const login = userData.login;
    const password = userData.password;

    if (!name || !dateOfBirth || !email || !login || !password) {
        return res.status(404).json({ error: 'User data is not valid!' });
    } else next();
}

const checkIsUserExist = async (req, res, next) => {
    const email = req.body.email;
    const login = req.body.login;

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
    const token = jwt.sign(req.body, process.env.JWT_ENCODE_KEY);

    return res.status(200).json({ jwtToken: token });
}

customersRouter.post('/register', [validateRegisterUserData, checkIsUserExist, saveUserData, generateJWTToken]);

// -----------------------------------------------------

const validateJWTToken = async (req, res, next) => {
    if (!req.body.jwtToken) {
        return res.status(404).json({ error: 'JWT token is not valid!' });
    } else next();
}

const verifyUserByJWTToken = async (req, res, next) => {
    const jwtToken = req.body.jwtToken;
    const userData = jwt.verify(jwtToken, process.env.JWT_ENCODE_KEY);

    res.status(200).json(userData);
}

customersRouter.post('/verify', [validateJWTToken, verifyUserByJWTToken]);

// -----------------------------------------------------

const validateLoginUserData = async (req, res, next) => {
    const userData = req.body;
    const login = userData.login;
    const password = userData.password;

    if (!login || !password) {
        return res.status(404).json({ error: 'Login or password is not valid!' });
    } else next();
}

const generateJWTByUserData = async (req, res, next) => {
    const login = req.body.login;
    const password = req.body.password;

    let userData;
    const allCustomers = await db.getAllCustomers();

    await allCustomers.map((customer) => {
        if (customer.login === login && customer.password === password) {
            userData = customer;
        }
    });

    if (!userData) {
        return res.status(404).json({ error: 'User with this jwt is not exist!' });
    }

    const token = jwt.sign(userData, process.env.JWT_ENCODE_KEY);
    res.status(200).json({ jwtToken: token });
}

customersRouter.post('/login', [validateLoginUserData, generateJWTByUserData]);


module.exports = customersRouter;