import { InferRawDocType } from 'mongoose';

export const AdminSchemaType = {
	login: { type: String, required: true },
	password: { type: String, required: true },
} as const;

export type AdminType = InferRawDocType<typeof AdminSchemaType>;
