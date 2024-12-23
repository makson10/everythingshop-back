import { CustomerType } from '../../types/customer.types';
import Customer from '../models/customer';

class CustomerUtils {
	static async getAllCustomers() {
		return await Customer.find();
	}

	static async addNewCustomer({
		name,
		dateOfBirth,
		email,
		login,
		password,
	}: CustomerType) {
		await Customer.create({
			name,
			dateOfBirth,
			email,
			login,
			password,
		});
	}
}

export default CustomerUtils;
