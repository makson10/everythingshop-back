import { Router } from 'express';
import {
	doesProductExistGet,
	get,
	getById,
	getPhotoAccessKeyGet,
} from './product.handlers';
import {
	addNewProductPost,
	deleteProductDelete,
} from './productManagement.handlers';
import { deleteCommentDelete } from './productCommentsManagement.handlers';

const productsRouter = Router();

productsRouter.get('/getPhotoAccessKey', getPhotoAccessKeyGet);
productsRouter.get('/', get);
productsRouter.get('/:productId', getById);
productsRouter.get('/doesProductExist/:productId', doesProductExistGet);

productsRouter.post('/addNewProduct', addNewProductPost);
productsRouter.delete('/deleteProduct/:productId', deleteProductDelete);

productsRouter.post('/:productId/addComment', addNewProductPost);
productsRouter.delete(
	'/:productId/deleteComment/:commentId',
	deleteCommentDelete
);

export default productsRouter;
