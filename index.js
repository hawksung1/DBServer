'use strict';
const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const path = require('path');
const router = require('./router');
const config = require('./config');
const socket = require('./socket.io');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));

app.use('/', router);

app.use((req, res, next) => {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  console.log(err);

  res.status(err.status || 500);
  res.send(err);
});

const server = http.createServer(app);
const io = require('socket.io')(server);

io.on('connect', socket.connect);



server.listen(config.port);
console.log(`server start on port ${config.port}`);
