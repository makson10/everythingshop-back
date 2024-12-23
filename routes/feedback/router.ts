import { Router } from 'express';
import {
	addNewFeedbackPost,
	deleteFeedbackDelete,
	get,
} from './feedback.handlers';

const feedbacksRouter = Router();
feedbacksRouter.get('/', get);
feedbacksRouter.post('/addNewFeedback', addNewFeedbackPost);
feedbacksRouter.delete('/deleteFeedback/:feedbackId', deleteFeedbackDelete);

export default feedbacksRouter;
