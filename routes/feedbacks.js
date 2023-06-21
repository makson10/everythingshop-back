const db = require("../sqlite");
const express = require('express');
const feedbacksRouter = express.Router();

// -----------------------------------------------------

feedbacksRouter.get('/', async (req, res) => {
    const allFeedbacks = await db.getAllFeedbacks();
    res.status(200).send(allFeedbacks);
});

// -----------------------------------------------------

const validateFeedbackData = async (req, res, next) => {
    const feedbackData = req.body;
    const userName = feedbackData.userName;
    const date = feedbackData.date;
    const feedbackText = feedbackData.feedbackText;
    const uniqueFeedbackId = feedbackData.uniqueFeedbackId;

    if (!userName || !date || !feedbackText || !uniqueFeedbackId) {
        return res.status(404).json({ error: 'Feedback data is not valid!' });
    } else next();
}

const addNewFeedback = async (req, res, next) => {
    await db.addNewFeedback(req.body);

    res.status(200).json({ success: true });
}

feedbacksRouter.post('/addNewFeedback', [validateFeedbackData, addNewFeedback]);

// -----------------------------------------------------

feedbacksRouter.delete('/deleteFeedback/:feedbackId', async (req, res) => {
    const feedbackId = req.params.feedbackId;
    await db.deleteFeedback(feedbackId);

    res.status(200).json({ success: true });
});

module.exports = feedbacksRouter;