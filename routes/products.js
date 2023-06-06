const db = require("../sqlite");
const express = require('express');
const productsRouter = express.Router();

productsRouter.get('/', async (req, res) => {
    try {
        const allProducts = await db.getAllProducts();
        res.status(200).send(allProducts);
    } catch (error) {
        res.status(500).send('Server returned error');
    }
});

productsRouter.post('/', async (req, res) => {
    console.log(req.body);
    res.sendStatus(200);
});


module.exports = productsRouter;