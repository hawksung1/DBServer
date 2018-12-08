'use strict';
const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/', (req, res, next) => {
	//console.log(__dirname, '../public/html/board.html');
	res.type('html').sendFile(path.join(__dirname, '../public/html/admin.html'));
	//res.sendFile(__dirname+"/../public/html/board.html");
});

module.exports = router;
