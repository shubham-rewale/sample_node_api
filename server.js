import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({path: './config.env'});
import app from './app.js';


process.on('uncaughtException', (err) => {
	console.log('Uncaught Exception... Shutting Down')
	console.log(err)
	process.exit(1);
});

process.on('unhandledRejection', (err) => {
	console.log('Unhandled Rejection... Shutting Down')
	console.log(err.name, err.message)
	process.exit(1);
});

mongoose.connect(process.env.DATABASE)
		.then((con) => { console.log('DB Connection is Successful');})
		.catch((err) => { console.log(err);});

const port = process.env.PORT || 3000;

app.listen(port, () => { console.log( `App is listening on ${port}`);});