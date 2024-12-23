import { InferRawDocType } from 'mongoose';

export const FeedbackSchemaType = {
	author: { type: String, required: true },
	date: { type: Number, required: true },
	feedbackText: { type: String, required: true },
	uniqueFeedbackId: { type: String, required: true },
} as const;

export type FeedbackType = InferRawDocType<typeof FeedbackSchemaType>;
