const express = require('express');
const { storageMiddleware } = require('@exzly-middlewares');

const app = express.Router();

app.post(
  '/single-memory-storage',
  storageMiddleware.memoryStorage.single('photo'),
  storageMiddleware.validateFileMimes(),
  storageMiddleware.saveToDisk('upload-test'),
  (req, res) => {
    // eslint-disable-next-line no-unused-vars
    const { buffer, ...fileWithoutBuffer } = req.file;
    return res.json(fileWithoutBuffer);
  },
);

app.post(
  '/array-memory-storage',
  storageMiddleware.memoryStorage.array('photos'),
  storageMiddleware.validateFileMimes(),
  storageMiddleware.saveToDisk('upload-test'),
  (req, res) => {
    return res.json(
      // eslint-disable-next-line no-unused-vars
      req.files.map(({ buffer, ...fileWithoutBuffer }) => fileWithoutBuffer),
    );
  },
);

app.post(
  '/single-disk-storage',
  storageMiddleware.diskStorage('test').single('photo'),
  storageMiddleware.validateFileMimes(),
  (req, res) => {
    return res.json(req.file);
  },
);

app.post(
  '/array-disk-storage',
  storageMiddleware.diskStorage('test').array('photos'),
  storageMiddleware.validateFileMimes(),
  (req, res) => {
    return res.json(req.files);
  },
);

app.post('/', (req, res) => {
  return res.json(req.body);
});

module.exports = app;
