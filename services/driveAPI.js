import { google } from 'googleapis';
import * as readline from 'readline';
import fs from 'fs';


const SCOPES = ['https://www.googleapis.com/auth/drive'];
const redirect_uris = ["urn:ietf:wg:oauth:2.0:oob","http://localhost"];

const authentication = () => {
	const client_secret = process.env.CLIENT_SECRET;
	const client_id = process.env.CLIENT_ID;
	const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
	return oAuth2Client;
}

function getCode(query) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans);
    }));
}

export const getAccessToken = async () => {
    try {
    	const auth = authentication();
		const authUrl = auth.generateAuthUrl({access_type: 'offline', scope: SCOPES});
	  	console.log('Authorize this app by visiting this url:', authUrl);
	  	//const rl = readline.createInterface({ input, output, });
	  	//const code = await rl.question('Enter the code from that page here: ');
	  	const code = await getCode('Enter the code from that page here: ');
	  	const { tokens }= await auth.getToken(code);
	    return tokens;
    } catch (err) {
    	console.log(err);
    	return false;
    }
}

export const uploadToDrive = async (token, filePath) => {
	try {
		// Authorize a client with credentials, then call the Google Drive API.
		const auth = authentication();
		auth.setCredentials(JSON.parse(token));
	  	const drive = google.drive({version: 'v3', auth: auth});
	  	const fileMetadata = {
			name: `${filePath.split('/').pop()}`,
		};
		const media = {
			mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			body: fs.createReadStream(filePath)
		};
		const receipt = await drive.files.create({ requestBody: fileMetadata, media: media});
		return receipt;
	}	
	catch (err) {
		console.log(err);
		return false;
	}
}