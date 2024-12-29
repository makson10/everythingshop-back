import { Request, Response, NextFunction } from 'express';
import DatabaseUtils from '../../db/utils';
import { utapi } from '../../utils/utapi';
import multer from 'multer';

const validateProductData = (
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	const { title, description, creator, price, uniqueProductId, comments } =
		req.body;

	if (
		!title ||
		!description ||
		!creator ||
		!price ||
		!uniqueProductId ||
		!comments
	) {
		res.status(400).json({ error: 'Product data is not valid!' });
	} else next();
};

const parseData = (req: Request, res: Response, next: NextFunction): void => {
	req.body.price = +req.body.price;
	req.body.comments = JSON.parse(req.body.comments);
	next();
};

const storeImages = async (req: Request, res: Response, next: NextFunction) => {
	const files = req.files as Express.Multer.File[];
	const convertedFiles = files.map(
		(file, index) =>
			new File([file.buffer], req.body.uniqueProductId + '_' + index + '.png')
	);
	const response = await utapi.uploadFiles(convertedFiles);

	req.body.photoIds = response.map((file) => file.data?.url);
	next();
};

const storeProductData = async (
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
			.status(400)
			.json({ success: false, errorMessage: 'Something went wrong' });
	}
};

const getProductData = async (
	req: Request<{ productId: string }>,
	res: Response,
	next: NextFunction
): Promise<void> => {
	const { productId } = req.params;

	const product = await DatabaseUtils.product.getProductByUniqueId(productId);
	if (!product) {
		res.status(404).json({
			success: false,
			errorMessage: 'Product with this uniqueProductId not found!',
		});
	} else {
		req.body.product = product.toObject();
		next();
	}
};

const deleteProductPhotoFiles = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	const { photoIds: imageUrls } = req.body.product;
	const imageDomain = 'https://utfs.io/f/';

	const deletingFilesKeys = imageUrls.map((url: string) =>
		url.replace(imageDomain, '')
	);
	await utapi.deleteFiles(deletingFilesKeys);
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
	multer().any(),
	validateProductData,
	parseData,
	storeImages,
	storeProductData,
];

export const deleteProductDelete = [
	getProductData,
	deleteProductPhotoFiles,
	deleteProductData,
];
