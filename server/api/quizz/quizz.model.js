'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var QuizzSchema = new Schema({
  name: { type: String, default: 'Some quizz' },
  slug: { type: String, default: 'some-quizz' },
  tags: { type: [String], default: [] },
  questions: {
    type: [
      {
        text: String,
        time: Number,
        answers: [
          {
            text: String,
            isOk: { type: Boolean, default: false }
          }
        ]
      }
    ],
    default: []
  }
});

module.exports = mongoose.model('Quizz', QuizzSchema);
