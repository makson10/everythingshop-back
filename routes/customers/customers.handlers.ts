import { Request, Response, NextFunction } from 'express';
import DatabaseUtils from '../../db/utils';
import jwt from 'jsonwebtoken';
const JWT_ENCODE_KEY = process.env.JWT_ENCODE_KEY!;

const getAllCustomers = async (req: Request, res: Response) => {
	const allCustomers = await DatabaseUtils.customer.getAllCustomers();
	res.status(200).json(allCustomers);
};

const validateRegisterUserData = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { name, dateOfBirth, email, login, password } = req.body;

	if (!name || !dateOfBirth || !email || !login || !password) {
		res.status(404).json({ error: 'User data is not valid!' });
	} else next();
};

const checkIsUserExist = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { email, login } = req.body;

	const allCustomers = await DatabaseUtils.customer.getAllCustomers();
	const isUserExist = allCustomers.some(
		(customer: any) => customer.email === email && customer.login === login
	);

	if (isUserExist) {
		res
			.status(404)
			.json({ error: 'User with this email or login already exists' });
	} else next();
};

const saveUserData = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const newUser = await DatabaseUtils.customer.addNewCustomer(req.body);
	req.body = newUser.toObject();
	next();
};

const generateJWTToken = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const newUser = req.body;
	const token = jwt.sign(newUser, JWT_ENCODE_KEY);

	res.status(200).json({ token, user: newUser });
};

const validateJWTToken = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { token } = req.body;

	if (!token) {
		res.status(404).json({ error: 'JWT token is not valid!' });
	} else next();
};

const verifyUserByJWTToken = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { token } = req.body;
	const userData = jwt.verify(token, JWT_ENCODE_KEY);

	res.status(200).json(userData);
};

const validateLoginUserData = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { login, password } = req.body;

	if (!login || !password) {
		res.status(404).json({ error: 'Login or password is not valid!' });
	} else next();
};

const getUserData = async (req: Request, res: Response, next: NextFunction) => {
	const { login, password } = req.body;

	const allCustomers = await DatabaseUtils.customer.getAllCustomers();
	const userData = allCustomers.find(
		(customer: any) =>
			customer.login === login && customer.password === password
	);

	if (!userData) {
		res.status(404).json({ error: 'User with this credential is not exist!' });
		return;
	}

	req.body.user = userData.toObject();
	next();
};

const generateJWTAndSendResponse = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { user } = req.body;

	const token = jwt.sign(user, JWT_ENCODE_KEY);
	res.status(200).json({ token, user });
};

export const get = [getAllCustomers];

export const registerPost = [
	validateRegisterUserData,
	checkIsUserExist,
	saveUserData,
	generateJWTToken,
];

export const verifyPost = [validateJWTToken, verifyUserByJWTToken];

export const loginPost = [
	validateLoginUserData,
	getUserData,
	generateJWTAndSendResponse,
];
