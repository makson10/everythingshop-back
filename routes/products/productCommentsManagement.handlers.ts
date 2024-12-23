import { Request, Response, NextFunction } from 'express';
import DatabaseUtils from '../../db/utils';

const validateNewCommentData = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { author, date, picture, text, uniqueCommentId } = req.body;

	if (!author || !date || !picture || !text || !uniqueCommentId) {
		res.status(404).json({ error: 'New comment data is not valid!' });
	} else next();
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
		req.body.oldComments = product.comments;
		next();
	}
};

const addNewComment = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { oldComments, author, date, picture, text, uniqueCommentId } =
		req.body;
	const newComment = {
		author,
		date,
		picture,
		text,
		uniqueCommentId,
	};

	const newComments = [...oldComments, newComment];
	req.body.newComments = newComments;

	next();
};

const updateComments = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { productId } = req.params;
	const { newComments } = req.body;

	await DatabaseUtils.product.updateProductComments(productId, newComments);
	res.status(200).json({ success: true });
};

const checkIsThisCommentExist = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { commentId } = req.params;
	const { oldComments } = req.body;

	const isCommentExist = oldComments.some(
		(comment: { uniqueCommentId: string }) =>
			comment.uniqueCommentId === commentId
	);

	if (!isCommentExist) {
		res
			.status(404)
			.json({ error: 'Comment with this uniqueCommentId not found!' });
	} else next();
};

const removeComments = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { commentId } = req.params;
	const { oldComments } = req.body;

	const commentForDeleteIndex = oldComments.findIndex(
		(comment: { uniqueCommentId: string }) =>
			comment.uniqueCommentId === commentId
	);

	const newComments = [...oldComments];
	newComments.splice(commentForDeleteIndex, 1);

	req.body.newComments = newComments;
	next();
};

export const addCommentPost = [
	validateNewCommentData,
	getProductData,
	addNewComment,
	updateComments,
];
export const deleteCommentDelete = [
	getProductData,
	checkIsThisCommentExist,
	removeComments,
	updateComments,
];
