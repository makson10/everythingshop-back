import mongoose from 'mongoose';
import { CustomerSchemaType } from '../../types/customer.types';

const CustomerSchema = new mongoose.Schema(CustomerSchemaType);
const Customer = mongoose.model('Customer', CustomerSchema, 'Customer');

export default Customer;
