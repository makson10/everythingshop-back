import { InferRawDocType } from 'mongoose';

export const CommentType = {
	date: { type: Number, required: true },
	text: { type: String, required: true },
	author: { type: String, required: true },
	picture: { type: String, required: true },
	uniqueCommentId: { type: String, required: true },
} as const;

export const ProductSchemaType = {
	title: { type: String, required: true },
	description: { type: String, required: true },
	photoIds: { type: [String], required: true },
	creator: { type: String, required: true },
	price: { type: Number, required: true },
	comments: { type: [CommentType], required: true },
	uniqueProductId: { type: String, required: true },
} as const;

export type CommentType = InferRawDocType<typeof CommentType>;
export type ProductType = InferRawDocType<typeof ProductSchemaType>;
