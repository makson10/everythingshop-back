const { google } = require('googleapis');
const serviceAccountCredentials = require('./googleCredentials.json');
const fs = require('fs');

const scopes = ['https://www.googleapis.com/auth/drive'];
const auth = new google.auth.JWT(
    serviceAccountCredentials.client_email, null, serviceAccountCredentials.private_key, scopes
);
const drive = google.drive({ version: 'v3', auth });

const getPhotoAccessToken = async () => {
    try {
        const photoAccessKey = await auth.getAccessToken();
        return photoAccessKey;
    } catch (error) {
        console.error(error);
    }
};

const uploadFile = async (localFileName) => {
    const requestBody = {
        name: `${localFileName}.png`,
        fields: 'id',
    };

    const filePath = process.cwd() + '/temporarilyFiles/' + localFileName;

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