import { Router } from 'express';
import {
	get,
	loginPost,
	registerPost,
	verifyPost,
} from './googleCustomers.handlers';

const googleCustomersRouter = Router();
googleCustomersRouter.get('/', get);
googleCustomersRouter.post('/register', registerPost);
googleCustomersRouter.post('/verify', verifyPost);
googleCustomersRouter.post('/login', loginPost);

export default googleCustomersRouter;
