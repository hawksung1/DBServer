'use strict';
var express = require('express');
var multer = require('multer');
const wrapper = require('../modules/wrapper');
var router = express.Router();
const db = require('../modules/db');

const session = require('express-session');
var FileStore = require('session-file-store')(session);
var bodyParser = require('body-parser');

var fileName;

router.use(bodyParser.urlencoded({extended:false}));
router.use(session({
  secret: 'fqiwofqewmf!@#$fqf',
  resave: false,
  saveUninitialized: true,
  store: new FileStore()
}));
router.get('/', function (req, res, next) {
  res.render('upload', { title: "파일 업로드" });
});

var storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, "routers/upload/")
  },
  filename: function (req, file, cb) {
    // var fileName = file.originalname;
    fileName = req.session.user_id + file.originalname;
    cb(null, fileName);
  }
});
var upload = multer({storage: storage});

var storage2 = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, "routers/upload/")
  },
  filename: function (req, file, cb) {
    // var fileName = file.originalname;
    fileName = req.body.upload_id + file.originalname;
    cb(null, fileName);
  }
});
var upload2 = multer({storage: storage2});
router.get('/', function (req, res, next) {
  res.render('upload', { title: "파일 업로드" });
});

var storage3 = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, "routers/requestUpload/")
  },
  filename: function (req, file, cb) {
    // var fileName = file.originalname;
    fileName = req.body.projclient_upload_id + req.body.request_upload_id + file.originalname;
    cb(null, fileName);
  }
});
var upload3 = multer({storage: storage3});
router.get('/', function (req, res, next) {
  res.render('upload', { title: "파일 업로드" });
});

var storage4 = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, "routers/requestUpload/")
  },
  filename: function (req, file, cb) {
    // var fileName = file.originalname;
    fileName = req.session.user_id + req.body.request_upload_id + file.originalname;
    cb(null, fileName);
  }
});
var upload4 = multer({storage: storage3});
router.get('/', function (req, res, next) {
  res.render('upload', { title: "파일 업로드" });
});

router.post('/', upload.single('file'), wrapper.asyncMiddleware(async (req, res, next) =>{
  var userID = req.session.user_id;
  var existfile = await db.getQueryResult(`SELECT FID FROM OuterPortfolio WHERE FID = '${userID}'`);
  console.log(existfile);
  if(existfile.length != 0){//file exist
    res.json(400, {
                   error: 1,
                   msg: "already exist file"
   });
  }else{
    await db.getQueryResult(`INSERT INTO OuterPortfolio (FID, DocName) VALUES ('${userID}', '${fileName}')`)
    res.redirect('http://localhost:3000');
  }
}));
router.post('/update', upload2.single('file'), wrapper.asyncMiddleware(async (req, res, next) =>{
  var userID = req.body.upload_id;
  var fileName2 = userID + fileName;
  console.log(userID);
  var existfile = await db.getQueryResult(`UPDATE OuterPortfolio SET DocName = '${fileName2}' WHERE FID = '${userID}'`);
  console.log(existfile);
  if(existfile.length == 0){//file exist
    res.json(400, {
                   error: 1,
                   msg: "no such file"
   });
  }else{
    res.redirect('http://localhost:3000/admin');
  }
}));
router.post('/request', upload3.single('request_file'), wrapper.asyncMiddleware(async (req, res, next) =>{
  var userID = req.body.projclient_upload_id;
  var requestID = req.body.request_upload_id;
  var fileName3 = userID +requestID+ fileName;
  console.log(userID);
  console.log(requestID);
  console.log(fileName3);
  var existfile = await db.getQueryResult(`UPDATE RequestDoc SET DocName = '${fileName}' WHERE RID = '${userID}'`);
  console.log(existfile);
  if(existfile.length == 0){//file exist
    res.json(400, {
                   error: 1,
                   msg: "no such file"
   });
  }else{
    res.redirect('http://localhost:3000/admin');
  }
}));
router.post('/pc_request', upload4.single('request_file'), wrapper.asyncMiddleware(async (req, res, next) =>{
  var userID = req.session.user_id;
  var requestID = req.body.request_upload_id;
  var fileName4 = userID +requestID+ fileName;

  var existfile = await db.getQueryResult(`INSERT INTO RequestDoc (RID, DocName) VALUES ('${fileName}', '${userID}')`);
  console.log(existfile);
  if(existfile.length == 0){//file exist
    res.json(400, {
                   error: 1,
                   msg: "no such file"
   });
  }else{
    res.redirect('http://localhost:3000/requestpage');
  }
}));
module.exports = router;
