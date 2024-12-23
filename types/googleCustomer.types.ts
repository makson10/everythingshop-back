import { InferRawDocType } from 'mongoose';

export const GoogleCustomerSchemaType = {
	id: { type: String, required: true },
	name: { type: String, required: true },
	email: { type: String, required: true },
	picture: { type: String, required: true },
} as const;

export type GoogleCustomerType = InferRawDocType<typeof GoogleCustomerSchemaType>;
