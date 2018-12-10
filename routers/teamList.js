'use strict';
const express = require('express');
const router = express.Router();
const wrapper = require('../modules/wrapper');
const db = require('../modules/db');
var bodyParser = require('body-parser')


router.post('/', wrapper.asyncMiddleware(async (req, res, next) => {
  const request = await db.getQueryResult('SELECT * FROM Attend ');
  res.json(request);
}));



router.post('/getTeam', wrapper.asyncMiddleware(async (req, res, next) => {

  const getRID = req.body.rID;

  //console.log(await db.getQueryResult('SELECT * FROM Apply where RID = "'+getRID+'" '));
  const getTeamList = await db.getQueryResult('SELECT * FROM Apply where RID = "'+getRID+'"');
  console.log(getTeamList);

  res.json(getTeamList);
}));


router.post('/selectTeam', wrapper.asyncMiddleware(async (req, res, next) => {

  const getTeamName = req.body.teamName;
  //const getRID = req.body.rID;

  //teamName -> Attend => RID(의뢰 ID), TName(팀 이름)

  //console.log("의뢰 ID: "+getRID);
  console.log("팀 이름: "+getTeamName);

 // console.log(await db.getQueryResult(`INSERT INTO Attend ( RID, TName ) values ('${getRID}','${getTeamName}')`));
  //console.log(await db.getQueryResult('UPDATE  Request SET State = "1" WHERE RID = "'+getRID+'"'));
  //const getTeamList = await db.getQueryResult('SELECT * FROM Attend where RID = "'+getRID+'"');
  res.json({success: true});
}));

/*
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
*/
module.exports = router;
