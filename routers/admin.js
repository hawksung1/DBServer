'use strict';
const express = require('express');
const router = express.Router();
const wrapper = require('../modules/wrapper');
const path = require('path');
const db = require('../modules/db');

router.get('/', (req, res, next) => {
	//console.log(__dirname, '../public/html/board.html');
	res.type('html').sendFile(path.join(__dirname, '../public/html/admin.html'));
	//res.sendFile(__dirname+"/../public/html/board.html");
});

router.get('/c_admin_Freelancer_manage', wrapper.asyncMiddleware(async (req, res, next) =>{
	var sql = `SELECT * FROM Freelancer a LEFT JOIN OuterPortfolio b ON a.FID=b.FID LEFT JOIN SkilledAt c ON a.FID=c.FID  `;
	const result = await db.getQueryResult(sql);
	// console.log(result);
	res.json(result);
}));
router.post('/c_admin_Freelancer_delete', wrapper.asyncMiddleware(async (req, res, next) =>{
	var id_delete = req.body.id;
	var sql = `DELETE FROM Freelancer WHERE FID = '${id_delete}'`;
	const result = await db.getQueryResult(sql);
	res.json(result);
}));
router.post('/c_admin_Freelancer_update', wrapper.asyncMiddleware(async (req, res, next) =>{
	const user_id = req.body.id;
  const newAge = req.body.age;
  const newName = req.body.name;
  const newPhone = req.body.phone;
  const newCareer = req.body.career;
  const newMajor = req.body.major;
  const newSkilledAt = req.body.language;
  const newLevel = req.body.level;
  // const newFile = req.body.file;

  if(newAge) await db.getQueryResult(`UPDATE Freelancer SET Age='${newAge}' WHERE FID='${user_id}'`);
  if(newName) await db.getQueryResult(`UPDATE Freelancer SET FName='${newName}' WHERE FID='${user_id}'`);
  if(newPhone) await db.getQueryResult(`UPDATE Freelancer SET PhoneNumber='${newPhone}' WHERE FID='${user_id}'`);
  if(newCareer) await db.getQueryResult(`UPDATE Freelancer SET Career='${newCareer}' WHERE FID='${user_id}'`);
  if(newMajor) await db.getQueryResult(`UPDATE Freelancer SET Major='${newMajor}' WHERE FID='${user_id}'`);
	if(newLevel) await db.getQueryResult(`UPDATE SkilledAt SET Skill='${newLevel}' WHERE FID='${user_id}' and LangName='${newSkilledAt}'`);
	// if(newFile) await db.getQueryResult();

  res.json({success:true});
}));

router.get('/c_admin_ProjClient_manage', wrapper.asyncMiddleware(async (req, res, next) =>{
	var sql = `SELECT * FROM ProjClient`;
	const result = await db.getQueryResult(sql);
	res.json(result);
}));
router.post('/c_admin_ProjClient_delete', wrapper.asyncMiddleware(async (req, res, next) =>{
	var id_delete = req.body.id;
	var sql = `DELETE FROM ProjClient WHERE PID = '${id_delete}'`;
	const result = await db.getQueryResult(sql);
	res.json(result);
}));
router.post('/c_admin_ProjClient_update', wrapper.asyncMiddleware(async (req, res, next) =>{
	const user_id = req.body.id;
  const newName = req.body.name;
  const newPhone = req.body.phone;
  // const newFile = req.body.file;

  if(newName) await db.getQueryResult(`UPDATE ProjClient SET CName='${newName}' WHERE PID='${user_id}'`);
  if(newPhone) await db.getQueryResult(`UPDATE ProjClient SET PhoneNumber='${newPhone}' WHERE PID='${user_id}'`);
	// if(newFile) await db.getQueryResult();

  res.json({success:true});
}));

router.get('/c_admin_request_manage', wrapper.asyncMiddleware(async (req, res, next) =>{
	var sql = `SELECT a.RID, PID, Pay, StartDate, EndDate, MinCareer, MinNum, MaxNum, CGrade, FGrade, State, DocName FROM Request a LEFT JOIN RequestDoc b ON a.RID = b.RID`;
	// var sql = 'Select * from Request where RID IN (Select a.RID FROM Request a LEFT JOIN RequestDoc b ON a.RID = b.RID) '
	const result = await db.getQueryResult(sql);
	res.json(result);
}));
router.post('/c_admin_request_delete', wrapper.asyncMiddleware(async (req, res, next) =>{
	var RID = req.body.rid;
	var PID = req.body.pid;
	var state = await db.getQueryResult(`SELECT State FROM Request WHERE RID = '${RID}' and PID = '${PID}'`);
	// console.log(""+rid_delete+" "+pid_delete);
	if(state[0].State == 0 || state[0].State == 4){
		var sql = `DELETE FROM Request WHERE PID = '${PID}' and RID = '${RID}'`;
		const result = await db.getQueryResult(sql);
		res.json(result);
	}else{
		res.json(400, {
                   error: 1,
                   msg: "request running"
		});
	}
}));
router.post('/c_admin_request_update', wrapper.asyncMiddleware(async (req, res, next) =>{
	var RID = req.body.rid;
	var PID = req.body.pid;
	var Pay = req.body.pay;
	var StartDate = req.body.startdate;
	var EndDate = req.body.enddate;
	var MinCareer = req.body.mincareer;
	var MinNum = req.body.minnum;
	var MaxNum = req.body.maxnum;
	var CGrade = req.body.cgrade;
	var FGrade = req.body.fgrade;
	var State = await db.getQueryResult(`SELECT State FROM Request WHERE RID = '${RID}' and PID = '${PID}'`);
	//0 하고 4 일때만 수정 가능하게
	if(State[0].State == 0 || State[0].State == 4){
		if(Pay) await db.getQueryResult(`UPDATE Request SET Pay='${Pay}' WHERE RID = '${RID}' and PID = '${PID}'`);
		if(StartDate) await db.getQueryResult(`UPDATE Request SET StartDate='${StartDate}' WHERE RID = '${RID}' and PID = '${PID}'`);
		if(EndDate) await db.getQueryResult(`UPDATE Request SET EndDate='${EndDate}' WHERE RID = '${RID}' and PID = '${PID}'`);
		if(MinCareer) await db.getQueryResult(`UPDATE Request SET MinCareer='${MinCareer}' WHERE RID = '${RID}' and PID = '${PID}'`);
		if(MinNum) await db.getQueryResult(`UPDATE Request SET MinNum='${MinNum}' WHERE RID = '${RID}' and PID = '${PID}'`);
		if(MaxNum) await db.getQueryResult(`UPDATE Request SET MaxNum='${MaxNum}' WHERE RID = '${RID}' and PID = '${PID}'`);
		if(CGrade) await db.getQueryResult(`UPDATE Request SET CGrade='${CGrade}' WHERE RID = '${RID}' and PID = '${PID}'`);
		if(FGrade) await db.getQueryResult(`UPDATE Request SET FGrade='${FGrade}' WHERE RID = '${RID}' and PID = '${PID}'`);
		res.json({success:true});
	}else{
		res.json(400, {
                   error: 1,
                   msg: "request running"
   });
	}
}));

router.get('/c_admin_Team_manage', wrapper.asyncMiddleware(async (req, res, next) =>{
	var sql = `SELECT * FROM TeamList a, TeamMember b WHERE a.TeamName = b.TeamName`;
	const result = await db.getQueryResult(sql);
	res.json(result);
}));
router.post('/c_admin_team_delete', wrapper.asyncMiddleware(async (req, res, next) =>{
	var TeamName = req.body.teamname;
	var check_sql = `SELECT RID FROM Attend WHERE TName = '${TeamName}'`
	var check = await db.getQueryResult(check_sql);

	if(check.length >= 1){
		var sql = `DELETE FROM TeamList WHERE TeamName = '${TeamName}'`;
		const result = await db.getQueryResult(sql);
		res.json(result);
	}else{
		res.json(400, {
                   error: 1,
                   msg: "team is working"
   });
	}
}));
router.post('/c_admin_team_update', wrapper.asyncMiddleware(async (req, res, next) =>{
	var TeamName = req.body.teamname;
	var MemberID = req.body.memberid;
	var ProjLeaderID = req.body.projleaderid;
	var check_sql = `SELECT RID FROM Attend WHERE TName = '${TeamName}'`
	var check = await db.getQueryResult(check_sql);

	if(check.length >= 1){
		if(MemberID) await db.getQueryResult(`UPDATE TeamMember SET MemberID='${MemberID}' WHERE TeamName = '${TeamName}'`);
		if(ProjLeaderID) await db.getQueryResult(`UPDATE TeamList SET ProjLeaderID='${ProjLeaderID}' WHERE TeamName = '${TeamName}'`);
		res.json({success:true});
	}else{
		res.json(400, {
                   error: 1,
                   msg: "team is working"
   });
	}
}));
module.exports = router;
