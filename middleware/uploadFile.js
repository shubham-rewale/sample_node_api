import multer from 'multer';

const multerStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'miscellaneous/');
	},
	filename: (req, file, cb) => {
		cb(null, `${(file.originalname).split('.')[0]}-${Date.now()}.xlsx`);
	}
});

export const upload = multer({ storage: multerStorage});

