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


router.get('/', wrapper.asyncMiddleware(async (req, res, next) => {
  const request = await db.getQueryResult('SELECT * FROM Message ');
  res.json(request);
}));

router.post('/sendRejectM', wrapper.asyncMiddleware(async (req, res, next) =>{
  const newMesID = req.body.mID; //메세지ID
  const newMContent = req.body.mContent; //거절 내용
  console.log("메세지 내용: "+newMContent);

  const getRID = req.body.mRID; // 의뢰ID
  const getPID = req.session.user_id; //의뢰자 ID

//  const newMFID = req.body.mFID; //프리랜서 ID
  console.log("의뢰 ID: "+getRID);
  const getTName = await db.getQueryResult('SELECT TName FROM Attend WHERE  RID = "'+getRID+'" ');

  console.log("팀 이름: "+getTName[0].TName);

  const getProjleaderID = await db.getQueryResult('SELECT ProjLeaderID FROM TeamList WHERE  TeamName = "'+getTName[0].TName+'" ');
  console.log("팀 대표 ID: "+getProjleaderID[0].ProjLeaderID);



    console.log("메세지 ID 내용 저장중");
  console.log(await db.getQueryResult(`INSERT INTO Message ( MesID, contents ) values ('${newMesID}','${newMContent}')`));
  console.log("메세지 ID 내용 저장완료 및 sended table 삽입");
  console.log(await db.getQueryResult(`INSERT INTO Sended ( PID, FID, RID, MesID) values ('${getPID}','${getProjleaderID[0].ProjLeaderID}','${getRID}','${newMesID}' )`));

  console.log("sended 완료 및 상태 3으로 변경");
  console.log(await db.getQueryResult('UPDATE  Request SET State = "3" WHERE RID = "'+getRID+'" AND PID = "'+getPID+'" '));

  //console.log(await db.getQueryResult(`INSERT INTO Freelancer (FID,FName,Age,PhoneNumber,Career,Major,Pwd) values ('${newId}','${newName}','${newAge}','${newPhone}','${newCareer}','${newMajor}','${newPassword}')`));
  res.json({success: true});
    console.log("3으로 변경 완료");
}));

module.exports = router;
