import { Router } from 'express';
import { get, registerPost, verifyPost, loginPost } from './customers.handlers';

const customersRouter = Router();
customersRouter.get('/', get);
customersRouter.post('/register', registerPost);
customersRouter.post('/verify', verifyPost);
customersRouter.post('/login', loginPost);

export default customersRouter;
