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

    /**
     * Create a new room for a quizz
     */
    socket.on('createRoom', function (data) {
      var gameId = slug(data.name);
      if (rooms.map(function (e) { return e.id; }).indexOf(gameId) !== -1) {
        socket.emit('roomCreated', { err: 'already' });
        return ;
      }

      rooms.push({ id: gameId, name: data.name, quizz: data.quizzId, players: 0 });

      socket.join(gameId);
      socket.emit('roomCreated', { id: gameId });
      socket.broadcast.emit('newRoom', { id: gameId });
    });

    /**
     * Join an existiong room
     */
    socket.on('join', function (data) {
      if (!data.room) { return; }
      socket.join(data.room);

      var room = rooms[rooms.map(function (e) { return e.id; }).indexOf(data.room)];

      if (room) {
        room.players++;
        io.sockets.in(data.room).emit('userJoin', { type: 'join', user: data.user, nbPlayers: room.players });
      }
    });

    /**
     * Leave a room
     */
    socket.on('leave', function (data) {
      socket.broadcast.to(data.room).emit('userLeave', { type: 'leave', user: data.user });
      socket.leave(data.room);

      var room = rooms[rooms.map(function (e) { return e.id; }).indexOf(data.room)];
      if (room) {
        room.players--;
        if (room.players === 0) {
          rooms.splice(rooms.map(function (e) { return e.id; }).indexOf(room.id), 1);
        }
      }
    });

    /**
     * Create a new message in the room
     */
    socket.on('postMessage', function (data) {
      console.log(data)
      io.sockets.in(data.room).emit('newMessage', { msg: data.msg, user: data.user });
    });

    // sockets inserts
    require('../api/quizz/quizz.socket.js').register(socket);

    socket.on('disconnect', function () {
      console.log('[%s] %s disconnected.', new Date().toUTCString(), socket.ip);
    });

    console.log('[%s] %s logged.', socket.connectDate.toUTCString(), socket.ip);

  });

};
