'use strict';
const express = require('express');
const router = express.Router();
const wrapper = require('../modules/wrapper');
const session = require('express-session');
const db = require('../modules/db');
const multer = require('multer');
const path = require('path');

var FileStore = require('session-file-store')(session);
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({extended:false}));
router.use(session({
  secret: 'fqiwofqewmf!@#$fqf',
  resave: false,
  saveUninitialized: true,
  store: new FileStore()
}));


router.post('/', wrapper.asyncMiddleware(async (req, res, next) => {
  const request = await db.getQueryResult('SELECT * FROM Attend ');
  res.json(request);
}));



router.post('/getTeam', wrapper.asyncMiddleware(async (req, res, next) => {

  const getRID = req.body.rID;

  //console.log(await db.getQueryResult('SELECT * FROM Apply where RID = "'+getRID+'" '));
  const getTeamList = await db.getQueryResult('SELECT * FROM Apply where RID = "'+getRID+'"');

  console.log(getTeamList);

  res.json(getTeamList);
}));

router.post('/searchTeamInfo', wrapper.asyncMiddleware(async (req, res, next) => {

  const getRID = req.body.rID; //Attend 에 넣을 의뢰 ID
  const getTeamName = req.body.teamName; //Attend 에 넣을 팀이름

  const getPID = req.session.user_id; //Attend 에 넘어간 의뢰를 수정하기 위해 필요한 의뢰자 ID


  //teamName -> Attend => RID(의뢰 ID), TName(팀 이름)
  console.log("----------------------------------------팀 선택 세부 목록: ");
  console.log("팀 이름: "+getTeamName);
  console.log("의뢰자 ID: "+getPID);
  console.log("의뢰 ID: "+getRID);


  // TeamList Table에서 getTeamName으로 TeamName 통해 ProjLeaderID get
  const getTeamMemberInfo = await db.getQueryResult(

  'select f.* , s.LangName, s.Skill from Freelancer f inner join SkilledAt s on f.FID = s.FID '
  +'WHERE EXISTS (select * from TeamMember m WHERE f.FID = m.MemberID AND TeamName = "'+getTeamName+'" )'
  +'order by f.FID'
  );
  console.log(getTeamMemberInfo);


  //const getLeaderInfo = await db.getQueryResult('SELECT * FROM Freelancer where FID = "'+getLeaderID+'"');

  res.json(getTeamMemberInfo);
}));



//-------------------------------------------------------------------------

router.post('/selectTeam', wrapper.asyncMiddleware(async (req, res, next) => {

  const getRID = req.body.rID; //Attend 에 넣을 의뢰 ID
  const getTeamName = req.body.teamName; //Attend 에 넣을 팀이름

  const getPID = req.session.user_id; //Attend 에 넘어간 의뢰를 수정하기 위해 필요한 의뢰자 ID


  //teamName -> Attend => RID(의뢰 ID), TName(팀 이름)

  console.log("팀 이름: "+getTeamName);
  console.log("의뢰자 ID: "+getPID);
  console.log("의뢰 ID: "+getRID);
  //Attend table에 수락한 팀이름과 그 의뢰 삽입
  console.log(await db.getQueryResult(`INSERT INTO Attend ( RID, TName ) values ('${getRID}','${getTeamName}')`));

  //Attend table에 들어갔는지 콘솔로그 확인
  console.log(await db.getQueryResult('SELECT * FROM Attend where RID = "'+getRID+'"'));


const curdate = await db.getQueryResult('SELECT curdate() ');
console.log(curdate);
  //팀을 정했으니 의뢰 상태를 구인중:0 에서 구인완료 및 진행중:1 으로 업데이트
  console.log(await db.getQueryResult('UPDATE  Request SET StartDate=curdate(), State = "1" WHERE RID = "'+getRID+'" AND PID = "'+getPID+'" '));
  //const getTeamList = await db.getQueryResult('SELECT * FROM Attend where RID = "'+getRID+'"');

  //의뢰가 구인 완료 및 진행 중이므로, 그 의뢰에 선청한 팀 목록 전부 삭제.
  console.log(await db.getQueryResult('DELETE FROM Apply where RID = "'+getRID+'"'));
  res.json({success: true});
}));

module.exports = router;
