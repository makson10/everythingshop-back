import DatabaseUtils from '../../db/utils';
import { Request, Response, NextFunction } from 'express';
import { getPhotoAccessToken } from '../../googleDriveClient';

const getPhotoAccessKey = async (req: Request, res: Response) => {
	const photoAccessKey = await getPhotoAccessToken();
	res.status(200).json({ token: photoAccessKey.token });
};

const getAllProducts = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const allProducts = await DatabaseUtils.product.getAllProducts();
	req.body.data = allProducts;
	next();
};

const sendResponse = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { data } = req.body;
	res.status(200).json(data);
};

const getProductData = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { productId } = req.params;

	const product = await DatabaseUtils.product.getProduct(productId);

	if (!product) {
		res.status(404).json({
			success: false,
			errorMessage: 'Product with this uniqueProductId not found!',
		});
	} else {
		req.body.data = product;
		next();
	}
};

const doesProductExist = async (req: Request, res: Response) => {
	const { productId } = req.params;

	const doesProductExist = await DatabaseUtils.product.doesProductExist(
		productId
	);
	res.json(doesProductExist);
};

export const getPhotoAccessKeyGet = [getPhotoAccessKey];
export const get = [getAllProducts, sendResponse];
export const getById = [getProductData, sendResponse];
export const doesProductExistGet = [doesProductExist];
