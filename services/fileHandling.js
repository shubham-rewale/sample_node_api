import xlsx from 'xlsx';
import fs from 'fs';
import util from 'util'

const unlink = util.promisify(fs.unlink);

export const readExcel = async (filePath) => {
	const file = xlsx.readFile(filePath);
	const sheets = file.SheetNames;
	let data = [];
	for(let i = 0; i < sheets.length; i++) {
		let temp = xlsx.utils.sheet_to_json(file.Sheets[sheets[i]]);
		temp.forEach((res) => {data.push(res);});
	}
	const dataObj = JSON.parse(JSON.stringify(data));
	return dataObj;
}

export const removeFile = async (filePath) => {
	await unlink(filePath);
	return true;
}