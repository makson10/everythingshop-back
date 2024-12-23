import { Request, Response, NextFunction } from 'express';
import DatabaseUtils from '../../db/utils';
import { deleteFile } from '../../googleDriveClient';

const validateProductData = (
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	const {
		photoIds,
		title,
		description,
		creator,
		price,
		uniqueProductId,
		comments,
	} = req.body;

	if (
		!photoIds.length ||
		!title ||
		!description ||
		!creator ||
		!price ||
		!uniqueProductId ||
		!comments
	) {
		res.status(404).json({ error: 'Product data is not valid!' });
	} else next();
};

const parseData = (req: Request, res: Response, next: NextFunction): void => {
	req.body.price = +req.body.price;
	req.body.comments = JSON.parse(req.body.comments);
	next();
};

const saveProductData = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const productData = req.body;

	try {
		await DatabaseUtils.product.addNewProduct(productData);
		res.status(200).json({ success: true });
	} catch (error) {
		res
			.status(404)
			.json({ success: false, errorMessage: 'Something went wrong' });
	}
};

const getProductData = async (
	req: Request<{ productId: string }>,
	res: Response,
	next: NextFunction
): Promise<void> => {
	const { productId } = req.params;

	const product = await DatabaseUtils.product.getProduct(productId);
	if (!product) {
		res.status(404).json({
			success: false,
			errorMessage: 'Product with this uniqueProductId not found!',
		});
	} else {
		req.body.product = product;
		next();
	}
};

const deleteProductPhotoFiles = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	const { photoIds } = req.body.product;

	await Promise.all(
		photoIds.map(async (photoId: string) => {
			await deleteFile(photoId);
		})
	);

	next();
};

const deleteProductData = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { productId } = req.params;

	await DatabaseUtils.product.deleteProduct(productId);
	res.status(200).json({ success: true });
};

export const addNewProductPost = [
	validateProductData,
	parseData,
	saveProductData,
];
export const deleteProductDelete = [
	getProductData,
	deleteProductPhotoFiles,
	deleteProductData,
];
