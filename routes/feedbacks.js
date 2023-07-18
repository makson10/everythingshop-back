const express = require('express');
const feedbacksRouter = express.Router();
const db = require("../db");

// -----------------------------------------------------

feedbacksRouter.get('/', async (req, res) => {
    const allFeedbacks = await db.getAllFeedbacks();
    res.status(200).send(allFeedbacks);
});

// -----------------------------------------------------

const validateFeedbackData = async (req, res, next) => {
    const { author, date, feedbackText, uniqueFeedbackId } = req.body;

    if (!author || !date || !feedbackText || !uniqueFeedbackId) {
        res.status(404).json({ error: 'Feedback data is not valid!' });
    } else next();
}

const addNewFeedback = async (req, res, next) => {
    await db.addNewFeedback(req.body);
    res.status(200).json({ success: true });
}

feedbacksRouter.post('/addNewFeedback', [validateFeedbackData, addNewFeedback]);

// -----------------------------------------------------

feedbacksRouter.delete('/deleteFeedback/:feedbackId', async (req, res) => {
    const { feedbackId } = req.params;
    await db.deleteFeedback(feedbackId);

    res.status(200).json({ success: true });
});


module.exports = feedbacksRouter;