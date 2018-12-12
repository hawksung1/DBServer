'use strict';
const express = require('express');
const router = express.Router();
const wrapper = require('../modules/wrapper');
const db = require('../modules/db');
const session = require('express-session');
var FileStore = require('session-file-store')(session);
var bodyParser = require('body-parser');
const path = require('path');

router.use(bodyParser.urlencoded({extended:false}));
router.use(session({
  secret: 'fqiwofqewmf!@#$fqf',
  resave: false,
  saveUninitialized: true,
  store: new FileStore()
}));
router.get('/info', (req, res, next) => {
	res.type('html').sendFile(path.join(__dirname, '../public/html/free_info.html'));
	//var url = req.url;
	//url = url.split('/');
	//console.log("url은.."+ url);
});
router.post('/cur_log', wrapper.asyncMiddleware(async (req, res, next) => {

  var tname = req.session.tname;
  res.json(tname);

}));

router.get('/belong', wrapper.asyncMiddleware(async (req, res, next) => {
  var user_id = req.session.user_id;
  const request = await db.getQueryResult('select * '
+'from TeamList '
+'where TeamName IN ('
+'Select TeamName '
+'from TeamMember '
+'where MemberID = "'+user_id+'" and TeamName not like "Single%")');
  res.json(request);
}));

router.post('/getfree', wrapper.asyncMiddleware(async (req, res, next) => {
  var user_id = req.session.user_id;
//평점 업뎃..
  const free_list = await db.getQueryResult('select FID from Freelancer');
  for(var i=0; i<free_list.length; i++){
    const aver_g = await db.getQueryResult('Select AVG(FGrade) as a '
+'from Request '
+'where RID IN( '
+'select RID '
+'from InnerPortfolio '
+'where FID = "'+free_list[i].FID+'") ');
  //console.log(free_list[i]);
    //console.log(aver_g[0].a);
    if(aver_g[0].a != null) {
      await db.getQueryResult('Update Freelancer '
      +'set GradeAver = "'+aver_g[0].a+'" where FID = "'+free_list[i].FID+'"');
    }
  }
  //const gradeupdate =

  const request = await db.getQueryResult('SELECT * FROM Freelancer where FID != "'+user_id+'"');
  res.json(request);
}));

router.post('/getfreeteam', wrapper.asyncMiddleware(async (req, res, next) => {
  var user_id = req.session.user_id;
  /*
  var obj = req.body.curl;
  obj = obj.split("?");
  obj = obj[1];
  */
  var tname = req.session.tname;//obj;
  //평점 업뎃..
    const free_list = await db.getQueryResult('select FID from Freelancer');
    for(var i=0; i<free_list.length; i++){
      const aver_g = await db.getQueryResult('Select AVG(FGrade) as a '
  +'from Request '
  +'where RID IN( '
  +'select RID '
  +'from InnerPortfolio '
  +'where FID = "'+free_list[i].FID+'") ');
    //console.log(free_list[i]);
      //console.log(aver_g[0].a);
      if(aver_g[0].a != null) {
        await db.getQueryResult('Update Freelancer '
        +'set GradeAver = "'+aver_g[0].a+'" where FID = "'+free_list[i].FID+'"');
      }
    }

  const request = await db.getQueryResult('Select * '
+'from Freelancer '
+'where FID IN ( '
+'Select MemberID '
+'from TeamMember '
+'where TeamName = "'+tname+'")');
  res.json(request);
}));

router.post('/f_info', wrapper.asyncMiddleware(async (req, res, next) => {
  var obj = req.body.curl;
  obj = obj.split("?");
  obj = obj[1];
  //console.log("url은.."+obj);
  const request = await db.getQueryResult('SELECT * FROM SkilledAt where FID = "'+obj+'"');
  //var user_id = req.session.user_id;
  //const request = await db.getQueryResult('SELECT * FROM SkilledAt where FID = "'+user_id+'"');
  res.json(request);
}));

router.post('/banfree', wrapper.asyncMiddleware(async (req, res, next) => {
  var banid = req.body.id;
  var obj = req.body.teamname;
  obj = obj.split("?");
  obj = obj[1];
  var tname = obj;
  //console.log("되느냐");
  //console.log(tname);
  const request = await db.getQueryResult('DELETE from TeamMember where MemberID = "'+banid+'" and TeamName = "'+tname+'"');

  res.json(request);
}));

router.post('/delteam', wrapper.asyncMiddleware(async (req, res, next) => {

  var obj = req.body.teamname;
  obj = obj.split("?");
  obj = obj[1];
  var tname = obj;

  //console.log("삭제해~");
  //console.log("되느냐");
  //console.log(tname);
  const request = await db.getQueryResult('DELETE from TeamList where TeamName = "'+tname+'"');

  res.json(request);
}));

router.post('/maketeam', wrapper.asyncMiddleware(async (req, res, next) =>{
  var user_id = req.session.user_id;
  var member = req.body.member;
  var tname = req.body.tname;

  var members = member.split(",");
  //console.log(members.length);

  //await db.getQueryResult('Insert INTO TeamList (TeamName, ProjLeaderID) values ("'+name+'" , "'+user_id+'")');
  //TeamMember에 추가
  //await db.getQueryResult('Insert INTO TeamMember (MemberID, TeamName) values ("'+user_id+'" , "'+name+'")');
  //apply 테이블에 이제 추가.
  if(tname.includes('Single')) console.log("single은 안되는데");
  else {
    await db.getQueryResult('Insert INTO TeamList (TeamName, ProjLeaderID) values ("'+tname+'" , "'+user_id+'")');
    await db.getQueryResult('Insert INTO TeamMember (MemberID, TeamName) values ("'+user_id+'" , "'+tname+'")');
    for(var i=0; i<members.length; i++) {
      await db.getQueryResult('Insert INTO TeamMember (MemberID, TeamName) values ("'+members[i]+'" , "'+tname+'")');
      console.log(members[i]);
    }
  }
  //console.log(user_id+member+tname);
  //const request = await db.getQueryResult('UPDATE Request Set FGrade = "'+point+'" where RID = "'+rid+'"');
  //await db.getQueryResult('UPDATE Request Set State = 5 where RID = "'+rid+'"');
  //await db.getQueryResult('Insert into InnerPortfolio (FID,RID) Values ("'+user_id+'" ,"'+rid+'")');
  res.json({success : "Updated Successfully", status : 200});

}));




module.exports = router;
