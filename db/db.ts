import mongoose from 'mongoose';

mongoose.connect(process.env.DB_URL!, {
	dbName: process.env.DB_DEFAULT_DATABASE_NAME!,
});
