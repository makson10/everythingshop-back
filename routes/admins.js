const db = require("../sqlite");
const express = require('express');
const adminsRouter = express.Router();

adminsRouter.get('/', async (req, res) => {
    try {
        const allAdmins = await db.getAllAdmins();
        res.status(200).send(allAdmins);
    } catch (error) {
        res.status(500).send('Server returned error');
    }
});

adminsRouter.post('/', async (req, res) => {
    console.log(req.body);
    res.sendStatus(200);
});


module.exports = adminsRouter;