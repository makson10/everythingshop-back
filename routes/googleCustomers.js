const db = require("../sqlite");
const express = require('express');
const googleCustomersRouter = express.Router();

// -----------------------------------------------------

googleCustomersRouter.get('/', async (req, res) => {
    const allGoogleCustomers = await db.getAllGoogleCustomers();
    res.status(200).send(allGoogleCustomers);
});

// -----------------------------------------------------

const validateRegisterGoogleUserData = (req, res, next) => {
    const userData = req.body;
    const id = userData.id;
    const name = userData.name;
    const email = userData.email;
    const picture = userData.picture;

    if (!id || !name || !email || !picture) {
        return res.status(404).json({ error: 'User data is not valid!' });
    } else next();
}

const checkIsGoogleUserExist = async (req, res, next) => {
    const email = req.body.email;

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
    const token = jwt.sign(req.body, process.env.JWT_ENCODE_KEY);

    return res.status(200).json({ jwtToken: token, isGoogleUser: true });
}

googleCustomersRouter.post('/register', [validateRegisterGoogleUserData, checkIsGoogleUserExist, saveGoogleUserData, generateJWTToken]);

// -----------------------------------------------------

const validateJWTToken = async (req, res, next) => {
    if (!req.body.jwtToken) {
        return res.status(404).json({ error: 'JWT token is not valid!' });
    } else next();
}

const verifyGoogleUserByJWTToken = async (req, res, next) => {
    const jwtToken = req.body.jwtToken;
    const googleUserData = jwt.verify(jwtToken, process.env.JWT_ENCODE_KEY);

    res.status(200).json(googleUserData);
}

googleCustomersRouter.post('/verify', [validateJWTToken, verifyGoogleUserByJWTToken]);

// -----------------------------------------------------

const validateLoginGoogleUserData = async (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;

    if (!name || !email) {
        return res.status(404).json({ error: 'Name or email is not valid!' });
    } else next();
}

const generateJWTByGoogleUserData = async (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;

    let googleUserData;
    const allGoogleCustomers = await db.getAllGoogleCustomers();

    await allGoogleCustomers.map((customer) => {
        if (customer.name === name && customer.email === email) {
            googleUserData = customer;
        }
    });

    if (!googleUserData) {
        return res.status(404).json({ error: 'User with this jwt is not exist!' });
    }

    const token = jwt.sign(googleUserData, process.env.JWT_ENCODE_KEY);
    res.status(200).json({ jwtToken: token, isGoogleUser: true });
}

googleCustomersRouter.post('/login', [validateLoginGoogleUserData, generateJWTByGoogleUserData]);


module.exports = googleCustomersRouter;