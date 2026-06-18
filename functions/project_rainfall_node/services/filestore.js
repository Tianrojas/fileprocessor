const catalyst = require('zcatalyst-sdk-node');
const fs = require('fs');
const os = require('os');
const path = require('path');

const FOLDER_ID = process.env.FILESTORE_FOLDER_ID;

async function uploadToFileStore(req, file) {
  const catalystApp = catalyst.initialize(req);
  const folder = catalystApp.filestore().folder(FOLDER_ID);

  const tempPath = path.join(os.tmpdir(), `${Date.now()}-${file.originalname}`);
  fs.writeFileSync(tempPath, file.buffer);

  const uploaded = await folder.uploadFile({
    code: fs.createReadStream(tempPath),
    name: file.originalname
  });

  fs.unlink(tempPath, () => {});

  return uploaded.id || uploaded.file_id || null;
}

async function downloadFromFileStore(req, fileId) {
  const catalystApp = catalyst.initialize(req);
  const folder = catalystApp.filestore().folder(FOLDER_ID);

  const fileBuffer = await folder.downloadFile(fileId);

  const tempPath = path.join(os.tmpdir(), `${fileId}`);
  fs.writeFileSync(tempPath, fileBuffer);

  return tempPath;
}

module.exports = {
  uploadToFileStore,
  downloadFromFileStore
};