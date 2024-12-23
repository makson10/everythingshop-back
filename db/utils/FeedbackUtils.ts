import { FeedbackType } from '../../types/feedback.types';
import Feedback from '../models/feedback';

class FeedbackUtils {
	static async getAllFeedbacks() {
		const feedbacks = await Feedback.find({});

		feedbacks.map((feedback) => {
			feedback.date = +feedback.date;
		});

		return feedbacks;
	}

	static async addNewFeedback({
		author,
		date,
		feedbackText,
		uniqueFeedbackId,
	}: FeedbackType) {
		const changedDate = date.toString();

		await Feedback.create({
			author,
			date: changedDate,
			feedbackText,
			uniqueFeedbackId,
		});
	}

	static async deleteFeedback(uniqueFeedbackId: string) {
		await Feedback.deleteOne({ uniqueFeedbackId });
	}
}

export default FeedbackUtils;
