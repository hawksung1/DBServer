'use strict';

exports.connect = (socket) => {
  console.log('connection');

  socket.emit('asd', 'haha');

};

