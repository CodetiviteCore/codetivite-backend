const { google } = require('googleapis');
const { JWT } = require('google-auth-library');
const path = require('path');

// Load credentials from the JSON key file
const auth = new JWT({
    keyFile: path.join(process.cwd(), 'drive-credentials.json'),
    scopes: ['https://www.googleapis.com/auth/drive.readonly']
});

// Create the Drive API client
const drive = google.drive({
    version: 'v3',
    auth
});

// Get the file ID of the file you want to retrieve
const fileId = 'file_id';

drive.files.get({
    fileId: fileId,
    fields: 'exportLinks'
}, (err, res) => {
    if (err) {
        console.error(err);
        return;
    }

    console.log(res.data.exportLinks["text/html"]);   
});