'use strict';
const express = require('express');
const router = express.Router();
const wrapper = require('../modules/wrapper');
const session = require('express-session');
const path = require('path');
const db = require('../modules/db');
const multer = require('multer');
var app = express();
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
	res.type('html').sendFile(path.join(__dirname, '../public/html/user_information_fix.html'));
});

router.post('/fix_freelancer', wrapper.asyncMiddleware(async (req, res, next) =>{
  const user_id = req.session.user_id;
  const newPassword = req.body.password;
  const newAge = req.body.age;
  const newName = req.body.name;
  const newPhone = req.body.phone;
  const newCareer = req.body.career;
  const newMajor = req.body.major;
  const newSkilledAt = req.body.skilledAt;
  const newLevel = req.body.level;
  const newFile = req.body.file;
  console.log("fix = " + user_id);
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/upload/')
    },
    filename: (req, file, cb) => {
      cb(null, user_id);
    }
  });
  const upload = multer({
    storage: storage,
  });
  const up = upload.fields([{name: 'file', maxCount: 1}]);

  if(newPassword) await db.getQueryResult(`UPDATE Freelancer SET Pwd='${newPassword}' WHERE FID='${user_id}'`);
  if(newAge) await db.getQueryResult(`UPDATE Freelancer SET Age='${newAge}' WHERE FID='${user_id}'`);
  if(newName) await db.getQueryResult(`UPDATE Freelancer SET FName='${newName}' WHERE FID='${user_id}'`);
  if(newPhone) await db.getQueryResult(`UPDATE Freelancer SET PhoneNumber='${newPhone}' WHERE FID='${user_id}'`);
  if(newCareer) await db.getQueryResult(`UPDATE Freelancer SET Career='${newCareer}' WHERE FID='${user_id}'`);
  if(newMajor) await db.getQueryResult(`UPDATE Freelancer SET Major='${newMajor}' WHERE FID='${user_id}'`);
  res.json({success:true});
}));

router.post('/fix_projclient', wrapper.asyncMiddleware(async (req, res, next) =>{
  const newPassword = req.body.password;
  const newName = req.body.name;
  const newPhone = req.body.phone;
  // console.log(newId + newPassword + newName + newPhone);
  if(newPassword) await db.getQueryResult(`UPDATE ProjClient SET Pwd='${newPassword}' WHERE PID='${user_id}'`);
  if(newName) await db.getQueryResult(`UPDATE ProjClient SET CName='${newName}' WHERE PID='${user_id}'`);
  if(newPhone) await db.getQueryResult(`UPDATE ProjClient SET PhoneNumber='${newPhone}' WHERE PID='${user_id}'`);
  res.json({success:true});
}));

router.get('/get_my_information', wrapper.asyncMiddleware(async (req, res, next) =>{
  const user_id = req.session.user_id;
  var freelancer_sql = `SELECT * FROM Freelancer where FID = '${user_id}'`;//'${newId}'
  var projClient_sql = `SELECT * FROM ProjClient where PID = '${user_id}'`;
  var result;
  if(result = await db.getQueryResult(freelancer_sql)){

  }else if(result = await db.getQueryResult(projClient_sql)){

  }
  console.log(result);
  res.send({result:result});
}));

module.exports = router;
