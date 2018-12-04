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
  // const newSkilledAt = req.body.skilledAt;
  // const newLevel = req.body.level;
  // const newFile = req.body.file;
  // console.log(newId);
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

  // console.log(await db.getQueryResult(`INSERT INTO Freelancer (FID,FName,Age,PhoneNumber,Career,Major,Pwd) values ('${newId}','${newName}','${newAge}','${newPhone}','${newCareer}','${newMajor}','${newPassword}')`));
//UPDATE Freelancer SET A=B WHERE FID=user.id
  res.json({success:true});
}));

router.post('/fix_projclient', wrapper.asyncMiddleware(async (req, res, next) =>{
  const newPassword = req.body.password;
  const newName = req.body.name;
  const newPhone = req.body.phone;
  // console.log(newId + newPassword + newName + newPhone);
  // console.log(await db.getQueryResult(`INSERT INTO ProjClient (PID,CName,PhoneNumber,Pwd) values('${newId}','${newName}', '${newPhone}','${newPassword}')`));
  var result =JSON.stringify({success:true});
  // console.log("router done");
  res.send(result);
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
