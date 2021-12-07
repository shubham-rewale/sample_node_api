import express from 'express';
import { upload, uploadExcel, getToken } from './controllers/routeHandler.js';


const app = express();

app.use(express.json());

app.use(express.urlencoded({extended: true}));

app.route('/api/upload_spreadsheet').post(upload.single('excel'), uploadExcel);

app.route('/api/get_user_access_token').get(getToken);

export default app;