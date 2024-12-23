import { Request, Response, NextFunction } from 'express';
import DatabaseUtils from '../../db/utils';
const jwt = require('jsonwebtoken');
const JWT_ENCODE_KEY = process.env.JWT_ENCODE_KEY;

const getAllGoogleCustomers = async (req: Request, res: Response) => {
	const allGoogleCustomers =
		await DatabaseUtils.googleCustomer.getAllGoogleCustomers();
	res.status(200).json(allGoogleCustomers);
};

const validateRegisterGoogleUserData = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { id, name, email, picture } = req.body;

	if (!id || !name || !email || !picture) {
		res.status(404).json({ error: 'User data is not valid!' });
	} else next();
};

const checkIsGoogleUserExist = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { email } = req.body;

	const allGoogleCustomers =
		await DatabaseUtils.googleCustomer.getAllGoogleCustomers();
	const isUserExist = allGoogleCustomers.some(
		(customer: { email: string }) => customer.email === email
	);

	if (isUserExist) {
		res.status(404).json({ error: 'User with this email already exists' });
	} else next();
};

const saveGoogleUserData = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	await DatabaseUtils.googleCustomer.addNewGoogleCustomer(req.body);
	next();
};

const generateJWTToken = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const token = jwt.sign(req.body, JWT_ENCODE_KEY);
	res.status(200).json({ jwtToken: token });
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

const verifyGoogleUserByJWTToken = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { token } = req.body;
	const user = jwt.verify(token, JWT_ENCODE_KEY);

	res.status(200).json(user);
};

const validateLoginGoogleUserData = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { id } = req.body;

	if (!id) {
		res.status(404).json({ error: 'Id is not valid!' });
	} else next();
};

const getGoogleUserData = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { id } = req.body;

	const allGoogleCustomers =
		await DatabaseUtils.googleCustomer.getAllGoogleCustomers();
	const googleUser = allGoogleCustomers.find(
		(googleCustomer: { id: string }) => googleCustomer.id === id
	);

	if (!googleUser) {
		res.status(404).json({ error: 'User with this data is not exist!' });
		return;
	}

	req.body.user = googleUser.toObject();
	next();
};

const generateJWTAndSendResponse = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { user } = req.body;

	const token = jwt.sign(user, JWT_ENCODE_KEY);
	res.status(200).json({ token });
};

export const get = [getAllGoogleCustomers];

export const registerPost = [
	validateRegisterGoogleUserData,
	checkIsGoogleUserExist,
	saveGoogleUserData,
	generateJWTToken,
];

export const verifyPost = [validateJWTToken, verifyGoogleUserByJWTToken];

export const loginPost = [
	validateLoginGoogleUserData,
	getGoogleUserData,
	generateJWTAndSendResponse,
];
