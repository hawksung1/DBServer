'use strict';
const express = require('express');
const router = express.Router();
const wrapper = require('../modules/wrapper');
const db = require('../modules/db');

router.get('/', wrapper.asyncMiddleware(async (req, res, next) => {
  const request = await db.getQueryResult('SELECT * FROM Request where State = 0');
  res.json(request);
}));

router.get('/doing', wrapper.asyncMiddleware(async (req, res, next) => {
  const request = await db.getQueryResult('Select * '
+'from Request'
+' where RID IN('
	+' Select RID'
	+' from Attend'
	+' where TName IN ('
		+' Select TeamName'
		+' from TeamMember'
		+' where MemberID = "hjwook"))'
+' order by RID');
  res.json(request);
/*
  console.log('Select *'
+'from Request'
+'where RID IN('
	+'Select RID'
	+'from Attend'
	+'where TName IN ('
		+'Select TeamName'
		+'from TeamMember'
		+'where MemberID = "hjwook"))'
+'order by RID');
*/
}));

router.get('/orderbydate', wrapper.asyncMiddleware(async (req, res, next) => {
  const request = await db.getQueryResult('SELECT * FROM Request where State = 0 ORDER BY StartDate');
  res.json(request);
}));

router.get('/orderbypay', wrapper.asyncMiddleware(async (req, res, next) => {
  const request = await db.getQueryResult('SELECT * FROM Request where State = 0 ORDER BY Pay');
  res.json(request);
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
