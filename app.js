const express = require('express');
const mongoose = require('mongoose');
const xlsx = require('xlsx');
const multer = require('multer');

const Collection_1 = require('./dataModel');
const drive = require('./googleDrive');

const multerStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, './uploadedSpreadsheets/');
	},
	filename: (req, file, cb) => {
		cb(null, `${(file.originalname).split('.')[0]}-${Date.now()}.xlsx`);
	}
})

const upload = multer({ storage: multerStorage});

const app = express();

mongoose.connect('mongodb://localhost:27017/testDB').then((con) => { console.log('DB Connection is Successful');})
													.catch((err) => { console.log(err);});

app.use(express.json());

app.use(express.urlencoded({extended: true}));

app.post('/api/upload-spreadsheet', upload.single('excel'), async function (req, res) {
	const file = xlsx.readFile(`./uploadedSpreadsheets/${req.file.filename}`);
	const sheets = file.SheetNames;
	let data = [];
	for(let i = 0; i < sheets.length; i++) {
		let temp = xlsx.utils.sheet_to_json(file.Sheets[sheets[i]]);
		temp.forEach((res) => {data.push(res);});
	}
	dataObj = JSON.parse(JSON.stringify(data));
	const receipt = await Collection_1.create(dataObj);
	const uploadReceipt = await drive.uploadFile(`./uploadedSpreadsheets/${req.file.filename}`);
	if (!receipt) {
		return res.status(500).json({
			status: 'fail',
		});
	}
	res.status(200).json({
		status: 'Success',
	});	
});

const port = 3000;

app.listen(port, () => {
	console.log(`App is listening on port ${port}`);
});