'use strict';
const express = require('express');
const router = express.Router();
const wrapper = require('../modules/wrapper');
const db = require('../modules/db');
const multer = require('multer');
const path = require('path');

router.get('/', wrapper.asyncMiddleware(async (req, res, next) => {
  const user = await db.getQueryResult('SELECT * FROM Freelancer');
  res.json(user);
}));

router.post('/insert_freelancer', wrapper.asyncMiddleware(async (req, res, next) =>{
  const newId = req.body.id;
  const newPassword = req.body.password;
  const newAge = req.body.age;
  const newName = req.body.name;
  const newPhone = req.body.phone;
  const newCareer = req.body.career;
  const newMajor = req.body.major;
  const newSkilledAt = req.body.skilledAt;
  const newLevel = req.body.level;
  const newFile = req.body.file;
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

  console.log(await db.getQueryResult(`INSERT INTO Freelancer (FID,FName,Age,PhoneNumber,Career,Major,Pwd) values ('${newId}','${newName}','${newAge}','${newPhone}','${newCareer}','${newMajor}','${newPassword}')`));

  res.json({success: true});
  router.post('/', up, (req, res, next) => {
    console.log("file uploaded");
    res.redirect('/');
  });
}));

router.post('/insert_projclient', wrapper.asyncMiddleware(async (req, res, next) =>{
  const newId = req.body.id;
  const newPassword = req.body.password;
  const newName = req.body.name;
  const newPhone = req.body.phone;

  console.log(await db.getQueryResult(`INSERT INTO ProjClient (PID,CName,PhoneNumber,Pwd) values('${newId}','${newName}', '${newPhone}','${newPassword}')`));
  res.json({success: true});
}));

module.exports = router;
