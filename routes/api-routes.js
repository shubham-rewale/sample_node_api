import express from 'express';
import { upload } from './../middleware/uploadFile.js';
import * as controllers from './../controllers/controllers.js';

const router = express.Router();

router.route('/get_user_access_token').get(controllers.getToken);

router.route('/upload_spreadsheet').post(upload.single('excel'), controllers.uploadExcel)

export default router;