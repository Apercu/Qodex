'use strict';

var rooms = [];

module.exports = function (io) {

  io.on('connection', function (socket) {

    socket.connectDate = new Date();
    socket.ip = (socket.handshake.address) ? socket.handshake.address : null;

    socket.on('join', function (data) {
      socket.join(data.room);
      socket.broadcast.to(data.room).emit('');
    });

    socket.on('leave', function (data) {
      socket.leave(data.room);
    });

    // sockets inserts
    require('../api/quizz/quizz.socket.js').register(socket);

    socket.on('disconnect', function () {
      console.log('[%s] %s disconnected.', new Date().toUTCString(), socket.ip);
    });

    console.log('[%s] %s logged.', socket.connectDate.toUTCString(), socket.ip);

  });

};
