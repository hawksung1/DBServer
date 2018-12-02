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
router.get('/count', function(req, res){
  if(req.session.count) {
    req.session.count++;
  } else {
    req.session.count = 1;
  }
  res.send('count : '+req.session.count);
});

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
  // console.log(newId);
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

router.post('/login', wrapper.asyncMiddleware(async (req, res, next) =>{
  var newId = req.body.id;
  var newPassword = req.body.password;
  var sql = 'SELECT FID, Pwd FROM Freelancer UNION SELECT PID, Pwd FROM ProjClient';
  var pass = false;
  const exist_user = await db.getQueryResult(sql);

  for(var i=0; i<exist_user.length; i++){
    var user_id = exist_user[i].FID;
    var user_pwd = exist_user[i].Pwd;
    if(user_id == newId && user_pwd == newPassword){//login success
      pass = true;
      console.log(newId+" login success");
      req.session.logined = true;
      req.session.user_id = newId;
      break;
    }
  }
  if(pass){
     res.json({success: true});
   }else{
     req.session.destroy()
     res.json(400, {
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
// app.listen(3000, () => {
//   console.log('listening 3000port');
// });
module.exports = router;
