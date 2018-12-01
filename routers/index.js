'use strict';
const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/', (req, res, next) => {
  res.type('html').sendFile(path.join(__dirname, '../public/html/test.html'));
  console.log(req.file);
});

module.exports = router;
