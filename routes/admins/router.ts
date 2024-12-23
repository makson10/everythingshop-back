import { Router } from 'express';
import { loginPost } from './admins.handlers';

const adminsRouter = Router();
adminsRouter.post('/login', loginPost);

export default adminsRouter;
