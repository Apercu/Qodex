'use strict';

var rooms = [];

module.exports = function (io) {

  io.on('connection', function (socket) {

    socket.connectDate = new Date();
    socket.ip = (socket.handshake.address) ? socket.handshake.address : null;

    socket.on('listRooms', function () {
      socket.emit('listRooms', rooms);
    });

    /*
    ** Create a new room for a quizz
    */
    socket.on('createRoom', function (data) {
      var gameId = Math.random() * 1000;
      rooms.push({ id: gameId, name: data.name });

      socket.broadcast.emit('newRoom', { id: gameId });
      socket.join(gameId);
    });

    /*
    ** Join an existing room
    */
    socket.on('join', function (data) {
      socket.join(data.room);
      socket.broadcast.to(data.room).emit({ type: 'join', user: data.user });
    });

    /*
    ** Leave a room
    */
    socket.on('leave', function (data) {
      socket.broadcast.to(data.room).emit({ type: 'leave', user: data.user });
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
