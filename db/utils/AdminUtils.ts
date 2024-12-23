import { AdminType } from '../../types/admin.types';
import Admin from '../models/admin';

class AdminUtils {
	static async getAllAdmins() {
		return await Admin.find();
	}

	static async isAdminExist({ login, password }: AdminType) {
		const admins = await Admin.find();

		return admins.some(
			(admin) => admin.login === login && admin.password === password
		);
	}
}

export default AdminUtils;
