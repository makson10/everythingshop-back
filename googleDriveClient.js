const { google } = require('googleapis');
const serviceAccountCredentials = require('./googleCredentials.json');
const fs = require('fs');
const baseFileFolderPath = process.cwd() + '/temporarilyFiles/';

const scopes = ['https://www.googleapis.com/auth/drive'];
const auth = new google.auth.JWT(
    serviceAccountCredentials.client_email, null, serviceAccountCredentials.private_key, scopes
);
const drive = google.drive({ version: 'v3', auth });

const getPhotoAccessToken = async () => {
    const photoAccessKey = await auth.getAccessToken();
    return photoAccessKey;
};

const uploadFile = async (localFileName) => {
    const requestBody = {
        name: `${localFileName}.png`,
        fields: 'id',
    };

    const filePath = baseFileFolderPath + localFileName;

    const media = {
        mimeType: 'image/png',
        body: fs.createReadStream(filePath),
    };

    const file = await drive.files.create({
        requestBody: requestBody,
        media: media,
    });

    return file.data.id;
};


const deleteFile = async (fileId) => {
    await drive.files.delete({ fileId: fileId });
};

const getListOfFiles = async () => {
    const listOfFiles = await drive.files.list({});
    return listOfFiles.data.files;
};

module.exports = {
    getPhotoAccessToken,
    uploadFile,
    deleteFile,
    getListOfFiles,
};