'use strict';
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/upload/')
  },
  filename: (req, file, cb) => {
    cb(null, new Date().valueOf() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
});
const up = upload.fields([{name: 'file', maxCount: 1}]);

router.post('/', up, (req, res, next) => {
  // res.redirect('/');
  console.log("file uploaded");
  res.jsonp({success : true});
});

module.exports = router;
