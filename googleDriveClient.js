const { google } = require('googleapis');
const fs = require('fs');

const scopes = ['https://www.googleapis.com/auth/drive'];
const auth = new google.auth.JWT(
    process.env.GOOGLE_CLIENT_EMAIL,
    null,
    process.env.GOOGLE_PRIVATE_KEY,
    scopes
);
const drive = google.drive({ version: 'v3', auth });

const getPhotoAccessToken = async () => {
    const photoAccessKey = await auth.getAccessToken();
    return photoAccessKey;
};

const deleteFile = async (fileId) => {
    await drive.files.delete({ fileId: fileId });
};

const getListOfFiles = async () => {
    const listOfFiles = await drive.files.list({});
    return listOfFiles.data.files;
};

// TODO: remove it later

module.exports = {
    getPhotoAccessToken,
    deleteFile,
    getListOfFiles,
};