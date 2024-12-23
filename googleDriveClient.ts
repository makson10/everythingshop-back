import { google } from 'googleapis';

const scopes = ['https://www.googleapis.com/auth/drive'];
const auth = new google.auth.JWT(
	process.env.GOOGLE_CLIENT_EMAIL,
	undefined,
	process.env.GOOGLE_PRIVATE_KEY,
	scopes
);
const drive = google.drive({ version: 'v3', auth });

const getPhotoAccessToken = async () => {
	const photoAccessKey = await auth.getAccessToken();
	return photoAccessKey;
};

const deleteFile = async (fileId: string) => {
	await drive.files.delete({ fileId: fileId });
};

export { getPhotoAccessToken, deleteFile };
