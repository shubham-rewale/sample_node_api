import { google } from 'googleapis';
import readline from 'readline';
import fs from 'fs';
import { eventEmitter } from './../controllers/routeHandler.js';


const SCOPES = ['https://www.googleapis.com/auth/drive'];
const redirect_uris = ["urn:ietf:wg:oauth:2.0:oob","http://localhost"];

export const uploadFile = async (req, res, filePath) => {
	if (!req.body.token) {
		return res.status(500).json({
			status: 'fail',
			message: 'Please Provide The Access Token'
		});
	}
	try {
		// Authorize a client with credentials, then call the Google Drive API.
		const client_secret = process.env.CLIENT_SECRET;
		const client_id = process.env.CLIENT_ID;
		const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
	  	oAuth2Client.setCredentials(JSON.parse(req.body.token));
	  	const drive = google.drive({version: 'v3', auth: oAuth2Client});
	  	const fileMetadata = {
			name: `${filePath.split('/').pop()}`,
		};
		const media = {
			mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			body: fs.createReadStream(filePath)
		};
		const receipt = await drive.files.create({ requestBody: fileMetadata, media: media})
		//fs.unlink(`./uploadedSpreadsheets/${req.file.filename}`, () => { return true; });
		//return res.status(201).json({
		//	status: 'success',
		//	message: 'File Has Been Uploaded'
		//});
	}	
	catch (err) {
		console.log(err);
		return res.status(500).json({
			status: 'fail',
			message: 'Access Token Not Found. Get The Access Token'
		});
	}
}


export const getAccessToken = (req, res) => {
	const client_secret = process.env.CLIENT_SECRET;
	const client_id = process.env.CLIENT_ID;
	const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

	const authUrl = oAuth2Client.generateAuthUrl({
    	access_type: 'offline',
    	scope: SCOPES,
  	});
  	console.log('Authorize this app by visiting this url:', authUrl);
  	const rl = readline.createInterface({
    	input: process.stdin,
    	output: process.stdout,
  	});
  	rl.question('Enter the code from that page here: ', (code) => {
    	rl.close();
    	oAuth2Client.getToken(code, (err, token) => {
   		   	if (err) {
   		   		console.error('Error retrieving access token', err);
   		   		return res.status(500).json({
   		   			status: 'fail'
   		   		});
   		   	}
   		   	console.log('Token Has Been Sent');
      		return res.status(200).json({
      			status: 'success',
      			token
      		});
      	});
  	});
}