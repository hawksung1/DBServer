'use strict';
const express = require('express');
const router = express.Router();
const wrapper = require('../modules/wrapper');
const session = require('express-session');
const db = require('../modules/db');
const multer = require('multer');
const path = require('path');

var FileStore = require('session-file-store')(session);
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({extended:false}));
router.use(session({
  secret: 'fqiwofqewmf!@#$fqf',
  resave: false,
  saveUninitialized: true,
  store: new FileStore()
}));



router.get('/', (req, res, next) => {
	//console.log(__dirname, '../public/html/board.html');
	res.type('html').sendFile(path.join(__dirname, '../public/html/requestpage.html'));
	//res.sendFile(__dirname+"/../public/html/board.html");
});

router.get('/request', wrapper.asyncMiddleware(async (req, res, next) => {
  var user_id = req.session.user_id;
  console.log("session id = " + user_id);

  const request = await db.getQueryResult('SELECT * FROM Request WHERE PID =  "'+user_id+'" ');
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
  const newRID = req.body.rnum;
  const newPID = req.session.user_id;
  const newPay = req.body.pay;
  const newMinNum = req.body.minNum;
  const newMaxNum = req.body.maxNum;
  const newCyear = req.body.cyear;

  //const newPID = req.session.user_id;
  //console.log("session id = " + user_id);
console.log("의뢰 생성 session id = " + newPID);
//  { newPID: req.session.user_id }

  //var newStartDate = 'SELECT NOW()';


  console.log(await db.getQueryResult(`INSERT INTO Request (PID, RID, PAY, MinCareer, MinNum, MaxNum) values ('${newPID}', '${newRID}','${newPay}','${newCyear}','${newMinNum}','${newMaxNum}' )`));

  //console.log(await db.getQueryResult(`INSERT INTO Freelancer (FID,FName,Age,PhoneNumber,Career,Major,Pwd) values ('${newId}','${newName}','${newAge}','${newPhone}','${newCareer}','${newMajor}','${newPassword}')`));
  res.json({success: true});
}));

router.post('/changeStateFinish', wrapper.asyncMiddleware(async (req, res, next) =>{
const getRID = req.body.rID;
const getPID = req.session.user_id;
console.log("의뢰 ID: "+getRID);
console.log("의뢰자: "+getRID);
console.log("의뢰 완료 수락 진행중");

  console.log(await db.getQueryResult('UPDATE  Request SET State = "4" WHERE RID = "'+getRID+'" AND PID = "'+getPID+'" '));

  //console.log(await db.getQueryResult(`INSERT INTO Freelancer (FID,FName,Age,PhoneNumber,Career,Major,Pwd) values ('${newId}','${newName}','${newAge}','${newPhone}','${newCareer}','${newMajor}','${newPassword}')`));
  res.json({success: true});
  console.log("의뢰 완료 수락 완료");
}));




module.exports = router;
