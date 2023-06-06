const db = require("../sqlite");
const express = require('express');
const googleCustomersRouter = express.Router();

googleCustomersRouter.get('/', async (req, res) => {
    try {
        const allGoogleCustomers = await db.getAllGoogleCustomers();
        res.status(200).send(allGoogleCustomers);
    } catch (error) {
        res.status(500).send('Server returned error');
    }
});

googleCustomersRouter.post('/', async (req, res) => {
    console.log(req.body);
    res.sendStatus(200);
});


module.exports = googleCustomersRouter;