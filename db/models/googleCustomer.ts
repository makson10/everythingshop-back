import mongoose from 'mongoose';
import { GoogleCustomerSchemaType } from '../../types/googleCustomer.types';

const GoogleCustomerSchema = new mongoose.Schema(GoogleCustomerSchemaType);
const GoogleCustomer = mongoose.model(
	'GoogleCustomer',
	GoogleCustomerSchema,
	'GoogleCustomer'
);

export default GoogleCustomer;
