import { Express } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

export const configureApp = (app: Express) => {
	// app.use(cors({
	//     origin: 'https://everythingshop.vercel.app',
	// }));
	app.use(cors());
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));
};
