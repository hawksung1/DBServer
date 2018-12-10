'use strict';
const express = require('express');
const router = express.Router();
const wrapper = require('../modules/wrapper');
const db = require('../modules/db');

router.get('/', (req, res, next) => {
	//console.log(__dirname, '../public/html/board.html');
	res.type('html').sendFile(path.join(__dirname, '../public/html/requestpage.html'));
	//res.sendFile(__dirname+"/../public/html/board.html");
});

router.get('/request', wrapper.asyncMiddleware(async (req, res, next) => {
  const request = await db.getQueryResult('SELECT * FROM Request ');
  res.json(request);
}));

router.get('/requestDate', wrapper.asyncMiddleware(async (req, res, next) => {
  const requestDate = await db.getQueryResult('SELECT * FROM Request order by STARTDATE ');
  res.json(requestDate);
}));

router.get('/requestPay', wrapper.asyncMiddleware(async (req, res, next) => {
  const requestPay = await db.getQueryResult('SELECT * FROM Request order by PAY ');
  res.json(requestPay);
}));


router.post('/insert', wrapper.asyncMiddleware(async (req, res, next) =>{
  const newRnum = req.body.rnum;
  const newName = req.body.name;
  const newPay = req.body.pay;
  const newMinNum = req.body.minNum;
  const newMaxNum = req.body.maxNum;
  const newCyear = req.body.cyear;
  //var newStartDate = 'SELECT NOW()';


  console.log(await db.getQueryResult(`INSERT INTO Request ( RID, PAY, MinCareer, MinNum, MaxNum) values ('${newRnum}','${newPay}','${newCyear}','${newMinNum}','${newMaxNum}' )`));

  //console.log(await db.getQueryResult(`INSERT INTO Freelancer (FID,FName,Age,PhoneNumber,Career,Major,Pwd) values ('${newId}','${newName}','${newAge}','${newPhone}','${newCareer}','${newMajor}','${newPassword}')`));
  res.json({success: true});
}));

module.exports = router;
