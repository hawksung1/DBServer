'use strict';
const express = require('express');
const router = express.Router();
const wrapper = require('../modules/wrapper');
const db = require('../modules/db');
const session = require('express-session');
var FileStore = require('session-file-store')(session);
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({extended:false}));
router.use(session({
  secret: 'fqiwofqewmf!@#$fqf',
  resave: false,
  saveUninitialized: true,
  store: new FileStore()
}));

router.get('/', wrapper.asyncMiddleware(async (req, res, next) => {
  const request = await db.getQueryResult('SELECT * FROM Request where State = 0');
  res.json(request);
}));

router.get('/cur_log', wrapper.asyncMiddleware(async (req, res, next) => {
  var user_id = req.session.user_id;
  //console.log("session id = " + user_id);
  var result = user_id;
  res.json(result);
  //res.send({result:result});
}));

router.get('/doing', wrapper.asyncMiddleware(async (req, res, next) => {
  var user_id = req.session.user_id;
  console.log("session id = " + user_id);
  //var result = user_id;
  //res.send({result:result});
  const request = await db.getQueryResult('Select * '
+'from Request'
+' where RID IN ('
	+' Select RID'
	+' from Attend'
	+' where TName IN ('
		+' Select TeamName'
		+' from TeamMember'
		+' where MemberID = ' +'"'+ user_id +'"'+ ' ))'
+' order by RID');
  res.json(request);
}));

router.get('/orderbydate', wrapper.asyncMiddleware(async (req, res, next) => {
  const request = await db.getQueryResult('SELECT * FROM Request where State = 0 ORDER BY StartDate');
  res.json(request);
}));

router.get('/orderbypay', wrapper.asyncMiddleware(async (req, res, next) => {
  const request = await db.getQueryResult('SELECT * FROM Request where State = 0 ORDER BY Pay');
  res.json(request);
}));
router.get('/apply_request', wrapper.asyncMiddleware(async (req, res, next) => {
  var user_id = req.session.user_id;
  const request = await db.getQueryResult('Select * '
+'from Request'
+' where RID IN ('
	+' Select RID'
	+' from Apply'
	+' where TName IN ('
		+' Select TeamName'
		+' from TeamMember'
		+' where MemberID = ' +'"'+ user_id +'"'+ ' ))'
+' order by RID');
  res.json(request);
}));

router.post('/apply', wrapper.asyncMiddleware(async (req, res, next) =>{
  var user_id = req.session.user_id;
  var newId = req.body.id;
  var client = req.body.cli_id;
  const request = await db.getQueryResult('Select count(*) AS count'
 + ' from SkilledAt as s, RequireLang as r'
+' where FID = "'+ user_id + '" and RID = "' + newId + '"'
+ ' and s.LangName = r.LangName and s.Skill>= r.Skill');
  //var teamName;
  //var client;
  var langcount;
  const required = await db.getQueryResult('Select count(*) AS count from RequireLang where RID = "1"');
  required.forEach(function(v){langcount = v.count; });
  //const test = await db.getQueryResult(`select * from Request where RID = '${newId}'`);

  //팀이나 개인지원 ㅅㅂ...
  request.forEach(async function(v){
    if(langcount == v.count) {
      console.log("성공");
      await db.getQueryResult('Insert INTO Apply (TName, PID, RID) values ("Single_1", "' + client +'" , "' + newId + '")');
    }
  });
  //console.log(request.count);
  //console.log(await db.getQueryResult(`select * from Request where RID = '${newId}'`));
  res.json({success : "Updated Successfully", status : 200});
  //res.json("{\"msg\":\"success\"}");
  //res.json({success: true, error: false});
}));
/*
router.post('/insert', wrapper.asyncMiddleware(async (req, res, next) =>{
  const newName = req.body.name;
  const newPhone = req.body.phone;

  console.log(await db.getQueryResult(`INSERT INTO Freelancer (FID, PhoneNumber) values ('${newName}', '${newPhone}')`));
  res.json({success: true});
}));
*/
module.exports = router;
