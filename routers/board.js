//게시판 출력하게 할 js 파일

'use strict';
const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/', (req, res, next) => {
	res.type('html').sendFile(path.join(__dirname, '../public/html/board.html'));
	//var url = req.url;
	//url = url.split('/');
	//console.log("url은.."+ url);
});
router.get('/info', (req, res, next) => {
	res.type('html').sendFile(path.join(__dirname, '../public/html/req_info.html'));
	//var url = req.url;
	//url = url.split('/');
	//console.log("url은.."+ url);
});
router.get('/teammake', (req, res, next) => {
	res.type('html').sendFile(path.join(__dirname, '../public/html/teammake.html'));
	//var url = req.url;
	//url = url.split('/');
	//console.log("url은.."+ url);
});
router.get('/team', (req, res, next) => {
	res.type('html').sendFile(path.join(__dirname, '../public/html/board_team.html'));
	//var url = req.url;
	//url = url.split('/');
	//console.log("url은.."+ url);
});
router.get('/team_manage', (req, res, next) => {
	res.type('html').sendFile(path.join(__dirname, '../public/html/team_manage.html'));
	//var url = req.url;
	//url = url.split('/');
	//console.log("url은.."+ url);
});
module.exports = router;



/*
'use strict';
const express = require('express');
const router = express.Router();
const wrapper = require('../modules/wrapper');
const db = require('../modules/db');

router.get('/', wrapper.asyncMiddleware(async (req, res, next) => {
  const user = await db.getQueryResult('SELECT * FROM Freelancer');
  res.json(user);
}));

router.post('/insert', wrapper.asyncMiddleware(async (req, res, next) =>{
  const newName = req.body.name;
  const newPhone = req.body.phone;

  console.log(await db.getQueryResult(`INSERT INTO Freelancer (FID, PhoneNumber) values ('${newName}', '${newPhone}')`));
  res.json({success: true});
}));

module.exports = router;
*/
