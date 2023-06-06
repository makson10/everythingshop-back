const db = require("../sqlite");
const express = require('express');
const customersRouter = express.Router();

customersRouter.get('/', async (req, res) => {
    try {
        const allCustomers = await db.getAllCustomers();
        res.status(200).send(allCustomers);
    } catch (error) {
        res.status(500).send('Server returned error');
    }
});

customersRouter.post('/', async (req, res) => {
    console.log(req.body);
    res.sendStatus(200);
});


module.exports = customersRouter;