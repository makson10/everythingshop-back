import { Express } from 'express';
import customersRouter from './customers/router';
import googleCustomersRouter from './googleCustomers/router';
import productsRouter from './products/router';
import adminsRouter from './admins/router';
import feedbacksRouter from './feedback/router';

export const configureRoutes = (app: Express) => {
	app.use('/customers', customersRouter);
	app.use('/googleCustomers', googleCustomersRouter);
	app.use('/products', productsRouter);
	app.use('/admins', adminsRouter);
	app.use('/feedbacks', feedbacksRouter);
};
