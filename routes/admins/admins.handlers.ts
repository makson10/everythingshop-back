import { Request, Response, NextFunction } from 'express';
import DatabaseUtils from '../../db/utils';

const validateAdminData = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { login, password } = req.body;

	if (!login || !password) {
		res.status(404).json({ error: 'Admin data is not valid!' });
	} else next();
};

const checkIsAdminExist = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const isAdminExist = await DatabaseUtils.admin.isAdminExist(req.body);

	if (isAdminExist) {
		res.status(200).json({ success: true });
	} else {
		res
			.status(404)
			.json({ error: "Admin with this credentials doesn't already exists" });
	}
};

export const loginPost = [validateAdminData, checkIsAdminExist];
