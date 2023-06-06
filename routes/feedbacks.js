const db = require("../sqlite");
const express = require('express');
const feedbacksRouter = express.Router();

feedbacksRouter.get('/', async (req, res) => {
    try {
        const allFeedbacks = await db.getAllFeedbacks();
        res.status(200).send(allFeedbacks);
    } catch (error) {
        res.status(500).send('Server returned error');
    }
});

feedbacksRouter.post('/', async (req, res) => {
    console.log(req.body);
    res.sendStatus(200);
});


module.exports = feedbacksRouter;