'use strict';
const express = require('express');
const router = express.Router();

const index = require('./routers/index');
const users = require('./routers/users');
const user_information_fix = require('./routers/user_information_fix');
const img = require('./routers/img');
const upload = require('./routers/upload');
const request = require('./routers/request');
const request = require('./routers/request_PC'); // requestpage.html js 의뢰 목록 보기 및 선택
const request = require('./routers/sendM'); // requestpage.html js 거절 메세지 보내기
const request = require('./routers/teamList'); // requestpage.html js 팀 목록 보기 및 선택

const admin = require('./routers/admin');


//게시판에 연결하게 하기위해 router에 변수 등록
const board = require('./routers/board');
//


router.use('/', index);
router.use('/users', users);
router.use('/img', img);
router.use('/request', request);
router.use('/upload', upload);
router.use('/user_information_fix', user_information_fix);
router.use('/admin', admin);

//이문규 파일들
router.use('/request_PC', request_PC);
router.use('/sendM', sendM);
router.use('/teamList', teamList);


//board 사용하도록.
router.use('/board', board);

//
module.exports = router;
