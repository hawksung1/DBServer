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

router.post('/info', wrapper.asyncMiddleware(async (req, res, next) => {
  var obj = req.body.curl;
  obj = obj.split("?");
  obj = obj[1];
  //console.log("url은.."+obj);
  const request = await db.getQueryResult('SELECT * FROM Request where RID = "'+obj+'"');

  res.json(request);
}));

router.post('/infolang', wrapper.asyncMiddleware(async (req, res, next) => {
  var obj = req.body.curl;
  obj = obj.split("?");
  obj = obj[1];
  //console.log("url은.."+obj);
  const request = await db.getQueryResult('SELECT * FROM RequireLang where RID = "'+obj+'"');

  res.json(request);
}));
router.post('/message', wrapper.asyncMiddleware(async (req, res, next) => {
  var obj = req.body.curl;
  obj = obj.split("?");
  obj = obj[1];//RID
  //console.log("url은.."+obj);
  const request = await db.getQueryResult('Select Contents '
  +'from Sended as s, Message as m '
  +'where s.MesID = m.MesID and RID = "'+obj+'"');
  //console.log(request);
  res.json(request);
}));

router.get('/', wrapper.asyncMiddleware(async (req, res, next) => {
  const request = await db.getQueryResult('SELECT * FROM Request where State = 0');
  res.json(request);
}));
router.get('/cur_log', wrapper.asyncMiddleware(async (req, res, next) => {
  var user_id = req.session.user_id;
  var result = user_id;
  res.json(result);
  //res.send({result:result});
}));

router.post('/onclick', wrapper.asyncMiddleware(async (req, res, next) => {
  var user_id = req.session.user_id;
  const newId = req.body.id;

  //console.log(req.url);
  var result = user_id;

  res.json(result);
}));
router.get('/doing', wrapper.asyncMiddleware(async (req, res, next) => {
  var user_id = req.session.user_id;
  console.log("session id = " + user_id);
  //var result = user_id;
  //res.send({result:result});
  const request = await db.getQueryResult('Select * '
+'from Request'
+' where State != 4 and RID IN ('
	+' Select RID'
	+' from Attend'
	+' where TName IN ('
		+' Select TeamName'
		+' from TeamMember'
		+' where MemberID = ' +'"'+ user_id +'"'+ ' ))'
+' order by RID');
  res.json(request);
}));
router.get('/comple_request', wrapper.asyncMiddleware(async (req, res, next) => {
  var user_id = req.session.user_id;
  //var result = user_id;
  //res.send({result:result});
  const request = await db.getQueryResult('Select * '
+'from Request'
+' where State = 4 and RID IN ('
	+' Select RID'
	+' from Attend'
	+' where TName IN ('
		+' Select TeamName'
		+' from TeamMember'
		+' where MemberID = ' +'"'+ user_id +'"'+ ' ))'
+' order by RID');
  res.json(request);
}));

router.get('/viewallreq', wrapper.asyncMiddleware(async (req, res, next) => {
  const request = await db.getQueryResult('SELECT * FROM Request ');
  res.json(request);
}));
router.get('/viewreq_s_0', wrapper.asyncMiddleware(async (req, res, next) => {
  const request = await db.getQueryResult('SELECT * FROM Request where State = 0');
  res.json(request);
}));

/*쿼리가 ㅅㅂ..
Create view langcount as
Select RID, count(RID) as re
from SkilledAt as s, RequireLang as r
where FID = "moon" and s.LangName = r.LangName and s.Skill>= r.Skill
group by r.RID;


Create view Reqcount as
Select RID, count(RID) as al
from RequireLang
group by RID;

Select *
from Request
where RID IN(
	Select l.RID
	from langcount as l,Reqcount as r
	where l.RID = r.RID and l.re = r.al);
drop view langcount;
drop view Reqcount;
*/
router.get('/viewreq_applyable', wrapper.asyncMiddleware(async (req, res, next) => {
  //const request = await db.getQueryResult('SELECT * FROM Request where State = 0 ORDER BY StartDate');
  var user_id = req.session.user_id;
  await db.getQueryResult('Create view langcount as '
+'Select RID, count(RID) as re '
+'from SkilledAt as s, RequireLang as r '
+'where FID = "'+user_id+'" and s.LangName = r.LangName and s.Skill>= r.Skill '
+'group by r.RID; ');
  await db.getQueryResult('Create view Reqcount as '
+'Select RID, count(RID) as al '
+'from RequireLang '
+'group by RID; ');
  const request = await db.getQueryResult('Select * '
+'from Request '
+'where RID IN( '
+'Select l.RID '
+'from langcount as l,Reqcount as r '
+'where l.RID = r.RID and l.re = r.al and State = 0 ); ');
  await db.getQueryResult('drop view langcount; ');
  await db.getQueryResult('drop view Reqcount;');

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

router.post('/apply', wrapper.asyncMiddleware(async (req, res, next) =>{//의뢰 지원시 작동
  var user_id = req.session.user_id;
  var newId = req.body.id;
  var client = req.body.cli_id;
  //프리랜서의 skill 중 해당 의뢰의 require 들에서 level 만족하는 언어 수
  const request = await db.getQueryResult('Select count(*) AS count'
 + ' from SkilledAt as s, RequireLang as r'
+' where FID = "'+ user_id + '" and RID = "' + newId + '"'
+ ' and s.LangName = r.LangName and s.Skill>= r.Skill');

  //의뢰에 필요한 언어 수
  const required = await db.getQueryResult('Select count(*) AS count from RequireLang where RID = "'+newId+'"');

  //single 팀 없으면 single 팀 만들어서 지원시키게해야함.
  //프리랜서가 속한 개인팀 이름 있는지 확인
  const is_in = await db.getQueryResult('Select TeamName '
          +'from TeamList '
          +'where ProjLeaderID = "'+user_id+'" and TeamName Like "Single%";');
  //조건 만족 한다
  if(request[0].count == required[0].count){
    //console.log("이야 만족한다");
    //개인팀 없을시 팀이름 새로 만들어서 넣어야함.
    if(is_in.length ==0){
      //console.log("없는데?");
    //TeamList 테이블에서 Single~ 로 시작하는 팀이름(개인팀) 중 가장 팀번호 높은애 뽑아옴 (근데 이거 text 정렬이라 26이 9보다 작음)
      const teamname = await db.getQueryResult('Select TeamName '
              +'from TeamList '
              +'where TeamName Like "Single%"'
              +'order by TeamName DESC '
              +'Limit 1;');
      //그 팀 이름을 일단 name에 저장하고
      var name = teamname[0].TeamName;
      //parsing해서 숫자부분만 뽑음
      name = name.split("Single");
      //얘는 숫자부분 저장. Single2 이런식이니 Single로 split 하면 1번째 배열 요소에 숫자 들어가있음
      var teamnum = name[1];
      //var 통합자료형이라 string에 곱셈하면 숫자로 변함 이제 거기다 1 더하면 Single2 -> Single3 를 만들수있다.
      teamnum = teamnum*1+1;
      name = "Single"+teamnum;
      //console.log(name);
      //없을시 새로 만든 팀네임으로 지원
      await db.getQueryResult('Insert INTO Apply (TName, PID, RID) values ("'+name+'", "' + client +'" , "' + newId + '")');
    }
    else{
      console.log(is_in[0].TeamName);
      await db.getQueryResult('Insert INTO Apply (TName, PID, RID) values ("'+is_in[0].TeamName+'", "' + client +'" , "' + newId + '")');
      //있을시 있던이름으로 지원
      //console.log("있다 있어");
    }
  }

  res.json({success : "Updated Successfully", status : 200});
  //res.json("{\"msg\":\"success\"}");
  //res.json({success: "true", error: false});
}));


router.post('/eval', wrapper.asyncMiddleware(async (req, res, next) =>{
  var user_id = req.session.user_id;
  var rid = req.body.id;
  var point = req.body.point;

  const request = await db.getQueryResult('UPDATE Request Set FGrade = "'+point+'" where RID = "'+rid+'"');
  await db.getQueryResult('UPDATE Request Set State = 5 where RID = "'+rid+'"');
  await db.getQueryResult('Insert into InnerPortfolio (FID,RID) Values ("'+user_id+'" ,"'+rid+'")');
  res.json({success : "Updated Successfully", status : 200});

}));
router.post('/complete', wrapper.asyncMiddleware(async (req, res, next) =>{
  //var user_id = req.session.user_id;
  var RID = req.body.id;
  var user_id = req.session.user_id;

  //const required = await db.getQueryResult('select * from ');
  const request = await db.getQueryResult('UPDATE Request Set State = 2 where RID = "'+RID+'"');
  res.json({success : "Updated Successfully", status : 200});

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
