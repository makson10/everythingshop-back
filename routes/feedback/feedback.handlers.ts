import { Request, Response, NextFunction } from 'express';
import DatabaseUtils from '../../db/utils';

const getAllFeedbacks = async (req: Request, res: Response) => {
	const allFeedbacks = await DatabaseUtils.feedback.getAllFeedbacks();
	res.status(200).send(allFeedbacks);
};

const validateFeedbackData = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { author, date, feedbackText, uniqueFeedbackId } = req.body;

	if (!author || !date || !feedbackText || !uniqueFeedbackId) {
		res.status(404).json({ error: 'Feedback data is not valid!' });
	} else next();
};

const addNewFeedback = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	await DatabaseUtils.feedback.addNewFeedback(req.body);
	res.status(200).json({ success: true });
};

const deleteFeedback = async (req: Request, res: Response) => {
	const { feedbackId } = req.params;
	await DatabaseUtils.feedback.deleteFeedback(feedbackId);

	res.status(200).json({ success: true });
};

export const get = [getAllFeedbacks];
export const addNewFeedbackPost = [validateFeedbackData, addNewFeedback];
export const deleteFeedbackDelete = [deleteFeedback];
