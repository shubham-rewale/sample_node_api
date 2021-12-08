import Collection_1 from '../models/dataModel.js';
import { getAccessToken, uploadToDrive } from '../services/driveAPI.js';
import { readExcel, removeFile } from '../services/fileHandling.js';



export const getToken = async (req, res) => {
	const token = await getAccessToken();
	if (token) {
		return res.status(200).json({
			status: 'success',
			token
		});	
	}
	res.status(401).json({
		status: 'fail'
	});
}


export const uploadExcel = async (req, res) => {
	try {
		const dataObj = await readExcel(`./miscellaneous/${req.file.filename}`);
		const dbReceipt = await Collection_1.create(dataObj);
		const uploadReceipt = await uploadToDrive(req.body.token, `./miscellaneous/${req.file.filename}`);
		if (dbReceipt && uploadReceipt) {
			await removeFile(`./miscellaneous/${req.file.filename}`);
			return res.status(201).json({
				status: 'success',
				message: 'File Has Been Uploaded'
			});
		}
	} catch (err) {
		console.log(err);
		await removeFile(`./miscellaneous/${req.file.filename}`);
		res.status(500).json({
			status: 'fail',
			data: err
		});
	}
};
