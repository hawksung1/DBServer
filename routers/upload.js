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

module.exports = router;
