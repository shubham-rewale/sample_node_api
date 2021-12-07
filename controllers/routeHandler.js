import fs from 'fs';
import Collection_1 from './../models/dataModel.js';
import { uploadFile, getAccessToken } from './../utils/googleDrive.js';
import { EventEmitter } from 'events'
import xlsx from 'xlsx';
import multer from 'multer';
const multerStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, './uploadedSpreadsheets/');
	},
	filename: (req, file, cb) => {
		cb(null, `${(file.originalname).split('.')[0]}-${Date.now()}.xlsx`);
	}
});
export const upload = multer({ storage: multerStorage});

export const eventEmitter = new EventEmitter();

export const uploadExcel = async (req, res) => {
	try {
		const file = xlsx.readFile(`./uploadedSpreadsheets/${req.file.filename}`);
		const sheets = file.SheetNames;
		let data = [];
		for(let i = 0; i < sheets.length; i++) {
			let temp = xlsx.utils.sheet_to_json(file.Sheets[sheets[i]]);
			temp.forEach((res) => {data.push(res);});
		}
		const dataObj = JSON.parse(JSON.stringify(data));
		await Collection_1.create(dataObj);
		await uploadFile(req, res,`./uploadedSpreadsheets/${req.file.filename}`);
		fs.unlink(`./uploadedSpreadsheets/${req.file.filename}`, () => { return true; });
		return res.status(201).json({
			status: 'success',
			message: 'File Has Been Uploaded'
		});
	} catch (err) {
		console.log(err);
		fs.unlink(`./uploadedSpreadsheets/${req.file.filename}`, () => { return true; });
		res.status(500).json({
			status: 'fail',
			data: err
		});
	}
};

export const getToken = (req, res) => {
	getAccessToken(req, res);
}
	