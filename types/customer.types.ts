import { InferRawDocType } from 'mongoose';

export const CustomerSchemaType = {
	name: { type: String, required: true },
	dateOfBirth: { type: String, required: true },
	email: { type: String, required: true },
	login: { type: String, required: true },
	password: { type: String, required: true },
} as const;

export type CustomerType = InferRawDocType<typeof CustomerSchemaType>;
