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
var fs = require('fs');
var download = require('download-file');

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

router.get('/c_download_file', wrapper.asyncMiddleware(async (req, res, next)
//working on
  const user_id = req.session.user_id;
  var sql = `SELECT DocName FROM OuterPortfolio WHERE FID = '${user_id}'`;
  var fileName =await db.getQueryResult(sql);
  fileName = fileName[0].DocName.toString();
  var file_path = __dirname + '/upload/' + fileName[0].DocName;
  console.log(fileName);
  var options = {
    directory: __dirname + "/download/",
    filename: fileName
  }
  res.download(file_path,options, function(err){
    if (err){
      console.log(err);
    } else {
      console.log('downloading successful');
    }
  });
}));
router.get('/c_show_file', wrapper.asyncMiddleware(async (req, res, next) =>{
  const user_id = req.session.user_id;
  var result = await db.getQueryResult(`SELECT * FROM OuterPortfolio WHERE FID = '${user_id}'`);
  res.send({result:result});
}));
router.get('/c_delete_file', wrapper.asyncMiddleware(async (req, res, next) =>{
  const user_id = req.session.user_id;
  var sql = `DELETE FROM OuterPortfolio WHERE FID  = '${user_id}'`;
  if(await db.getQueryResult(sql)){//success
    res.redirect('http://localhost:3000/user_information_fix');
  }else{//fail
    res.json(400, {
                   error: 1,
                   msg: "already exist file"
   });
  }
}));

module.exports = router;
