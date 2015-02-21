'use strict';

var slug = require('slug');

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
      var gameId = slug(data.name);
      rooms.push({ id: gameId, name: data.name, quizz: data.quizzId, players: 0 });

      socket.join(gameId);
      socket.emit('roomCreated', { id: gameId });
      socket.broadcast.emit('newRoom', { id: gameId });
    });

    /*
    ** Join an existing room
    */
    socket.on('join', function (data) {
      socket.join(data.room);
      socket.broadcast.to(data.room).emit({ type: 'join', user: data.user });
      rooms[rooms.map(function (e) { return e.id; }).indexOf(data.room)].players++;
    });

    /*
    ** Leave a room
    */
    socket.on('leave', function (data) {
      socket.broadcast.to(data.room).emit({ type: 'leave', user: data.user });
      socket.leave(data.room);
      rooms[rooms.map(function (e) { return e.id; }).indexOf(data.room)].players--;
    });



    // sockets inserts
    require('../api/quizz/quizz.socket.js').register(socket);

    socket.on('disconnect', function () {
      console.log('[%s] %s disconnected.', new Date().toUTCString(), socket.ip);
    });

    console.log('[%s] %s logged.', socket.connectDate.toUTCString(), socket.ip);

  });

};
