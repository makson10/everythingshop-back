import { GoogleCustomerType } from '../../types/googleCustomer.types';
import GoogleCustomer from '../models/googleCustomer';

class GoogleCustomerUtils {
	static async getAllGoogleCustomers() {
		return await GoogleCustomer.find({});
	}

    static async addNewGoogleCustomer({
		id,
		name,
		email,
		picture,
	}: GoogleCustomerType) {
		await GoogleCustomer.create({
			id,
			name,
			email,
			picture,
		});
	}
}

export default GoogleCustomerUtils;
