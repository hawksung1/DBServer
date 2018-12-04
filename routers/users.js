'use strict';
const express = require('express');
const router = express.Router();
const wrapper = require('../modules/wrapper');
const session = require('express-session');
const db = require('../modules/db');
const multer = require('multer');
const path = require('path');
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

router.post('/insert_freelancer', wrapper.asyncMiddleware(async (req, res, next) =>{
  const user_id = req.session.user_id;
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
  console.log(await db.getQueryResult(`INSERT INTO Freelancer (FID,FName,Age,PhoneNumber,Career,Major,Pwd) values ('${newId}','${newName}','${newAge}','${newPhone}','${newCareer}','${newMajor}','${newPassword}')`));
  res.json({success:true});
}));

router.post('/insert_projclient', wrapper.asyncMiddleware(async (req, res, next) =>{
  const newId = req.body.id;
  const newPassword = req.body.password;
  const newName = req.body.name;
  const newPhone = req.body.phone;
  // console.log(newId + newPassword + newName + newPhone);
  console.log(await db.getQueryResult(`INSERT INTO ProjClient (PID,CName,PhoneNumber,Pwd) values('${newId}','${newName}', '${newPhone}','${newPassword}')`));
  var result =JSON.stringify({success:true});
  console.log("router done");
  res.send(result);
}));

router.post('/login', wrapper.asyncMiddleware(async (req, res, next) =>{
  var newId = req.body.id;
  var newPassword = req.body.password;
  var freelancer_sql = 'SELECT FID, Pwd FROM Freelancer';
  var projClient_sql = 'SELECT PID, Pwd FROM ProjClient';
  var freelancer_pass = false;
  var projClient_pass = false;
  var result;
  const exist_freelancer_user = await db.getQueryResult(freelancer_sql);
  const exist_projClient_user = await db.getQueryResult(projClient_sql);

  for(var i=0; i<exist_freelancer_user.length; i++){
    var user_id = exist_freelancer_user[i].FID;
    var user_pwd = exist_freelancer_user[i].Pwd;
    if(user_id == newId && user_pwd == newPassword){//login success
      freelancer_pass = true;
      console.log(newId+"freelancer login success");
      result = "freelancer";
      req.session.logined = true;
      req.session.user_id = newId;
      break;
    }
  }
  for(var i=0; i<exist_projClient_user.length; i++){
    var user_id = exist_projClient_user[i].PID;
    var user_pwd = exist_projClient_user[i].Pwd;
    if(user_id == newId && user_pwd == newPassword){//login success
      projClient_pass = true;
      console.log(newId+"projClient login success");
      result = "projclient";
      req.session.logined = true;
      req.session.user_id = newId;
      break;
    }
  }
  console.log(result);
  if(freelancer_pass || projClient_pass){
     res.status(200).json({result:result});
   }else{
     req.session.destroy()
     res.status(400).json({
                    error: 1,
                    msg: "login fail"
                 });
   }
}));
router.post('/logout', wrapper.asyncMiddleware(async (req, res, next) =>{

   if(delete req.session.destroy()){  // 세션 삭제)
     res.json({success: true});
   }else{
     res.json(400, {
                    error: 1,
                    msg: "logout fail"
    });
   }
}));

router.get('/get_session', wrapper.asyncMiddleware(async (req, res, next) =>{
  var user_id = req.session.user_id;
  console.log("session id = " + user_id);
  var result = user_id;
  res.send({result:result});
}));
// app.listen(3000, () => {
//   console.log('listening 3000port');
// });
module.exports = router;
