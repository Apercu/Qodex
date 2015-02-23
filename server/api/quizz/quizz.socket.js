'use strict';

var Quizz = require('./quizz.model');

exports.register = function (socket) {

  Quizz.schema.post('save', function (doc) {
    socket.emit('Quizz:save', doc);
  });

  Quizz.schema.post('remove', function (doc) {
    socket.emit('Quizz:remove', doc);
  });

};
