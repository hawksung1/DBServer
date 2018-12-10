'use strict';
const express = require('express');
const router = express.Router();
const wrapper = require('../modules/wrapper');
const db = require('../modules/db');

router.get('/', wrapper.asyncMiddleware(async (req, res, next) => {
  const request = await db.getQueryResult('SELECT * FROM Message ');
  res.json(request);
}));

router.post('/sendRejectM', wrapper.asyncMiddleware(async (req, res, next) =>{
  const newMesID = req.body.mID;
  const newMRID = req.body.mRID;
  const newMPID = req.body.mPID;
  const newMFID = req.body.mFID;
  const newMContent = req.body.mContent;
 
  console.log(await db.getQueryResult(`INSERT INTO Message ( MesID, contents ) values ('${newMesID}','${newMContent}')`));

  console.log(await db.getQueryResult(`INSERT INTO Sended ( PID, FID, RID, MesID) values ('${newMPID}','${newMFID}','${newMRID}','${newMesID}' )`));
  
  //console.log(await db.getQueryResult(`INSERT INTO Freelancer (FID,FName,Age,PhoneNumber,Career,Major,Pwd) values ('${newId}','${newName}','${newAge}','${newPhone}','${newCareer}','${newMajor}','${newPassword}')`));
  res.json({success: true});
}));

module.exports = router;