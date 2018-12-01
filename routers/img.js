'use strict';
const express = require('express');
const router = express.Router();
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/upload/')
  },
  filename: (req, file, cb) => {
    cb(null, 'uploaded-img.jpg')
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024*1024*10
  }
});
const up = upload.fields([{name: 'img', maxCount: 1}]);

router.post('/', up, (req, res, next) => {
  res.redirect('/');
});

module.exports = router;