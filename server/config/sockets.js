'use strict';

var slug = require('slug');
var async = require('async');
var Quizz = require('../api/quizz/quizz.model');
var User = require('../api/user/user.model');

var rooms = [];

module.exports = function (io) {

  io.on('connection', function (socket) {

    socket.connectDate = new Date();
    socket.ip = (socket.handshake.address) ? socket.handshake.address : null;

    socket.on('listRooms', function () {
      var out = [];
      rooms.forEach(function (room) {
        if (!room.launched) {
          out.push(room);
        }
      });
      socket.emit('listRooms', out);
    });

    socket.on('checkRoom', function (data) {
      var room = rooms[rooms.map(function (e) { return e.id; }).indexOf(data.room)];
      socket.emit('checkRoom', ((room && room.launched || !room) ? false : true));
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
      socket.qodexRoom = data.room;
      socket.qodexUser = { id: data.userId, username: data.user };

      var room = rooms[rooms.map(function (e) { return e.id; }).indexOf(data.room)];

      if (room) {
        room.players.push({ id: data.userId, username: data.user, points: 0 });
        room.nbPlayers++;
        io.sockets.in(data.room).emit('userJoin', { type: 'join', user: data.user, players: room.players });
      }
    });

    function leaveRoom (data) {
      socket.leave(data.room);

      var room = rooms[rooms.map(function (e) { return e.id; }).indexOf(data.room)];
      if (room) {
        room.players.splice(room.players.map(function (e) { return e.id; }).indexOf(data.userId), 1);
        socket.broadcast.to(data.room).emit('userLeave', { type: 'leave', user: data.user, players: room.players });

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
      socket.qodexRoom = null;
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
        io.sockets.in(data.room).emit('initGame', room.players);
        Quizz.findById(room.quizz).lean().exec(function (err, quizz) {
          if (err || !quizz) { return; }

          room.quizzObj = quizz;

          async.eachSeries(quizz.questions, function (que, done) {

            room.players.forEach(function (player) {
              player.lastValid = false;
            });

            var safeQuestion = { _id: que._id, text: que.text, time: que.time, answers: [] };

            que.answers.forEach(function (answer) {
              safeQuestion.answers.push({ text: answer.text });
            });

            io.sockets.in(data.room).emit('nextQuestion', safeQuestion);

            setTimeout(function () {
              io.sockets.in(data.room).emit('updatePlayersInfo', room.players);
            }, safeQuestion.time * 1e3);

            setTimeout(function () {
              done();
            }, (que.time * 1e3 + 2e3) || 10000);

          }, function (err) {
            if (!err) {
              io.sockets.in(data.room).emit('gameFinished');
              room.players.forEach(function (player) {
                User.update({ _id: player.id }, { $inc: { points: player.points } }).exec();
              });
            } else {
              console.log(err);
            }
          });
        });
      }
    });

    /**
     * Listen for user answers
     */
    socket.on('respond', function (data) {
      var room = rooms[rooms.map(function (e) { return e.id; }).indexOf(data.room)];
      if (room) {
        var question = room.quizzObj.questions[room.quizzObj.questions.map(function (e) { return String(e._id); }).indexOf(data.questionId)];
        if (question) {
          io.sockets.in(data.room).emit('playerMove', data.userId);
          question.answers.forEach(function (answer) {
            if (answer.isOk && String(answer.text) === data.answer) {
              var player = room.players[room.players.map(function (e) { return e.id }).indexOf(data.userId)];
              if (player) {
                player.points += Number(data.points);
                player.lastValid = true;
              }
              return;
            }
          });
        }

      }
    });

    // sockets inserts

    socket.on('disconnect', function () {
      if (socket.qodexRoom) {
        leaveRoom({ room: socket.qodexRoom, user: socket.qodexUser.username, userId: socket.qodexUser.id });
      }

      console.log('[%s] %s disconnected.', new Date().toUTCString(), socket.ip);
    });

    console.log('[%s] %s logged.', socket.connectDate.toUTCString(), socket.ip);

  });

};
