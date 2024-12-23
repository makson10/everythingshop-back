require('dotenv').config();
import { configureApp } from './configureApp';
import { configureRoutes } from './routes/configureRoutes';
import './db/db';

import express from 'express';
const app = express();

configureApp(app);
configureRoutes(app);

app.listen(process.env.PORT, () => {
	console.log(`Server started on ${process.env.PORT} port`);
});
