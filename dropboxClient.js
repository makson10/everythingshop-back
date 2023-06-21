const Dropbox = require('dropbox');
const accessToken = process.env.DROPBOX_TOKEN;
const dbx = new Dropbox.Dropbox({ accessToken: accessToken });

module.exports = dbx;