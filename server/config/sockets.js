'use strict';

var slug = require('slug');
var async = require('async');
var Quizz = require('../api/quizz/quizz.model');

var rooms = [];

module.exports = function (io) {

  io.on('connection', function (socket) {

    socket.connectDate = new Date();
    socket.ip = (socket.handshake.address) ? socket.handshake.address : null;

    socket.on('listRooms', function () {
      socket.emit('listRooms', rooms);
    });

    socket.on('checkRoom', function (data) {
      var room = rooms[rooms.map(function (e) { return e.id; }).indexOf(data.room)];
      socket.emit('checkRoom', (room && room.launched ? false : true));
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

      rooms.push({ id: gameId, name: data.name, quizz: data.quizzId, players: [], nbPlayers: 0, launched: false });

      socket.join(gameId);
      socket.emit('roomCreated', { id: gameId });
      socket.broadcast.emit('newRoom', { id: gameId, name: data.name, quizz: data.quizzId, nbPlayers: 1 });
    });

    /**
     * Join an existiong room
     */
    socket.on('join', function (data) {
      if (!data.room) { return; }
      socket.join(data.room);

      var room = rooms[rooms.map(function (e) { return e.id; }).indexOf(data.room)];

      if (room) {
        room.players.push({ id: data.userId, points: 0 });
        room.nbPlayers++;
        io.sockets.in(data.room).emit('userJoin', { type: 'join', user: data.user, nbPlayers: room.nbPlayers });
      }
    });

    function leaveRoom (data) {
      socket.broadcast.to(data.room).emit('userLeave', { type: 'leave', user: data.user });
      socket.leave(data.room);

      var room = rooms[rooms.map(function (e) { return e.id; }).indexOf(data.room)];
      if (room) {
        room.players.splice(room.players.map(function (e) { return e.id; }).indexOf(data.userId), 1);

        room.nbPlayers--;
        if (room.nbPlayers === 0) {
          io.sockets.emit('removeRoom', { id: room.id });
          rooms.splice(rooms.map(function (e) { return e.id; }).indexOf(room.id), 1);
        }
      }
    }

    /**
     * Leave a room
     */
    socket.on('leave', function (data) {
      leaveRoom(data);
    });

    /**
     * Create a new message in the room
     */
    socket.on('postMessage', function (data) {
      io.sockets.in(data.room).emit('newMessage', { msg: data.msg, user: data.user });
    });

    /**
     * Launch the game
     */
    socket.on('launchGame', function (data) {
      var room = rooms[rooms.map(function (e) { return e.id; }).indexOf(data.room)];

      if (room && !room.launched) {
        room.launched = true;
        io.sockets.in(data.room).emit('initGame');
        Quizz.findById(room.quizz).lean().exec(function (err, quizz) {
          if (err || !quizz) { return; }

          room.quizzObj = quizz;

          async.eachSeries(quizz.questions, function (question, done) {

            question.answers.forEach(function (a) { delete a.isOk; }); //prevent smart people to be dumb

            io.sockets.in(data.room).emit('nextQuestion', question);
            setTimeout(function () {
              done();
            }, (question.time * 1e3 + 1e3) || 10000);

          }, function (err) {
            if (!err) {
              io.sockets.in(data.room).emit('gameFinished', {});
              // TODO calc scores here?
            } else {
              console.log(err); // error handling
            }
          });
        });
      }
    });

    /**
     * Listen for user answers
     */
    socket.on('respond', function (data) {
      console.log(data);
    });

    // sockets inserts

    socket.on('disconnect', function () {
      console.log('[%s] %s disconnected.', new Date().toUTCString(), socket.ip);
    });

    console.log('[%s] %s logged.', socket.connectDate.toUTCString(), socket.ip);

  });

};
