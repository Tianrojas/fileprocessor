'use strict';

require('dotenv').config();

const express = require('express');
const multer = require('multer');
const catalyst = require('zcatalyst-sdk-node');
const fs = require('fs');
const os = require('os');
const path = require('path');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

const FOLDER_ID = process.env.FILESTORE_FOLDER_ID;

if (!FOLDER_ID) {
  throw new Error("Missing FILESTORE_FOLDER_ID in environment");
}


app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file received' });
    }

    const catalystApp = catalyst.initialize(req);
    const folder = catalystApp.filestore().folder(FOLDER_ID);

    const tempPath = path.join(
      os.tmpdir(),
      `${Date.now()}-${req.file.originalname}`
    );

    fs.writeFileSync(tempPath, req.file.buffer);

    const uploaded = await folder.uploadFile({
      code: fs.createReadStream(tempPath),
      name: req.file.originalname
    });

    fs.unlink(tempPath, () => {});

    return res.status(200).json({
      status: 'stored',
      file_id: uploaded.id || null,
      raw: uploaded
    });

  } catch (err) {
    console.error('UPLOAD NODE ERROR:', err);
    return res.status(500).json({
      error: err.message || String(err)
    });
  }
});

module.exports = app;
