'use strict';
const express = require('express');
const router = express.Router();
const wrapper = require('../modules/wrapper');
const session = require('express-session');
const path = require('path');
const db = require('../modules/db');
const multer = require('multer');
// const Axios = require('axios');
var app = express();
var FileStore = require('session-file-store')(session);
var bodyParser = require('body-parser');
var fs = require('fs');
var download = require('download-file');
//move file1.htm from 'test/' to 'test/dir_1/'
// moveFile('./test/file1.htm', './test/dir_1/');
//moves the $file to $dir2
var moveFile = (file, dir2)=>{
  //include the fs, path modules
  var fs = require('fs');
  var path = require('path');

  //gets file name and adds it to dir2
  var f = path.basename(file);
  var dest = path.resolve(dir2, f);

  fs.rename(file, dest, (err)=>{
    if(err) throw err;
    else console.log('Successfully moved');
  });
};
//example, copy file1.htm from 'test/dir_1/' to 'test/'
// copyFile('./test/dir_1/file1.htm', './test/');
//copy the $file to $dir2
var copyFile = (file, dir2)=>{
  //include the fs, path modules
  var fs = require('fs');
  var path = require('path');

  //gets file name and adds it to dir2
  var f = path.basename(file);
  var source = fs.createReadStream(file);
  var dest = fs.createWriteStream(path.resolve(dir2, f));

  source.pipe(dest);
  source.on('end', function() { console.log('Succesfully downloaded'); });
  source.on('error', function(err) { console.log(err); });
};



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
router.post('/insert_freelancer_skill', wrapper.asyncMiddleware(async(req, res, next) =>{
  const user_id = req.session.user_id;
  const newLanguage = req.body.language;
  const newLevel = req.body.level;
  const sql = `INSERT INTO SkilledAt (FID, LangName, Skill) VALUES ('${user_id}', '${newLanguage}', '${newLevel}')`;
  console.log(await db.getQueryResult(sql));
  res.json({success:true});
}));
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

  if(newPassword) await db.getQueryResult(`UPDATE Freelancer SET Pwd=password('${newPassword}') WHERE FID='${user_id}'`);
  if(newAge) await db.getQueryResult(`UPDATE Freelancer SET Age='${newAge}' WHERE FID='${user_id}'`);
  if(newName) await db.getQueryResult(`UPDATE Freelancer SET FName='${newName}' WHERE FID='${user_id}'`);
  if(newPhone) await db.getQueryResult(`UPDATE Freelancer SET PhoneNumber='${newPhone}' WHERE FID='${user_id}'`);
  if(newCareer) await db.getQueryResult(`UPDATE Freelancer SET Career='${newCareer}' WHERE FID='${user_id}'`);
  if(newMajor) await db.getQueryResult(`UPDATE Freelancer SET Major='${newMajor}' WHERE FID='${user_id}'`);
  res.json({success:true});
}));
router.post('/fix_projclient', wrapper.asyncMiddleware(async (req, res, next) =>{
  const user_id = req.session.user_id;
  const newPassword = req.body.password;
  const newName = req.body.name;
  const newPhone = req.body.phone;
  // console.log(newId + newPassword + newName + newPhone);
  if(newPassword) await db.getQueryResult(`UPDATE ProjClient SET Pwd=password('${newPassword}') WHERE PID='${user_id}'`);
  if(newName) await db.getQueryResult(`UPDATE ProjClient SET CName='${newName}' WHERE PID='${user_id}'`);
  if(newPhone) await db.getQueryResult(`UPDATE ProjClient SET PhoneNumber='${newPhone}' WHERE PID='${user_id}'`);
  res.json({success:true});
}));
router.get('/c_freelancer_information', wrapper.asyncMiddleware(async (req, res, next) =>{
  const user_id = req.session.user_id;
	const freelancer_sql = `SELECT * FROM Freelancer a LEFT JOIN OuterPortfolio b ON a.FID=b.FID LEFT JOIN SkilledAt c ON a.FID=c.FID WHERE a.FID='${user_id}' `;
  const check_freelancer = await db.getQueryResult(`SELECT * FROM Freelancer WHERE FID='${user_id}'`);
  var result;
  if(check_freelancer.length >= 1){//is freelancer
	   result = await db.getQueryResult(freelancer_sql);
   }
	// console.log(result);
	res.json(result);
}));
router.get('/c_projclient_information', wrapper.asyncMiddleware(async (req, res, next) =>{
  const user_id = req.session.user_id;
  const projclient_sql = `SELECT * FROM ProjClient WHERE PID='${user_id}' `;
  const check_projclient = await db.getQueryResult(`SELECT * FROM ProjClient WHERE PID='${user_id}'`);
  var result;
  if(check_projclient.length >= 1){//is freelancer
	   result = await db.getQueryResult(projclient_sql);
   }
	// console.log(result);
	res.json(result);
}));
router.get('/c_show_innerportfolio', wrapper.asyncMiddleware(async (req, res, next) =>{
  const user_id = req.session.user_id;
  const innerportfolio_sql = `Select * from Request where RID IN (Select RID from InnerPortfolio where FID = '${user_id}')`;
  var result = await db.getQueryResult(innerportfolio_sql);
	// console.log(result);
	res.json(result);
}));
router.get('/c_download_file', wrapper.asyncMiddleware(async (req, res, next) =>{
//working on
  const user_id = req.session.user_id;
  var sql = `SELECT DocName FROM OuterPortfolio WHERE FID = '${user_id}'`;
  var fileName =await db.getQueryResult(sql);
  // console.log(fileName);
  fileName = fileName[0].DocName.toString();
  // console.log(fileName);
  var download_path = __dirname + "/download/";
  var file_path = __dirname + "/upload/" + fileName;
  copyFile(file_path,download_path);

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
