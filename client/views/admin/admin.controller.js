'use strict';

angular.module('qodex')
  .controller('AdminCtrl', function ($http) {

    var vm = this;

    $http.get('/api/quizzs').then(function (res) {
      console.log(res.data);
    });

    angular.extend(vm, {
      name: 'AdminCtrl',

      newTag: '',
      newQuestion: { text: '', answers: [] },
      newAnswer: { text: '', isOk: false },
      newQuizz: {
        name: '',
        tags: [],
        questions: []
      },

      /*
      ** Create a new tag for the quizz
      */
      addTag: function () {
        if (!vm.newTag || vm.newQuizz.tags.indexOf(vm.newTag) !== -1) {
          vm.newTag = '';
          return;
        }

        vm.newQuizz.tags.push(vm.newTag);
        vm.newTag = '';
      },

      /*
      ** Create a newQuestion for the quizz, require a text and at least
      ** one answer.
      */
      addQuestion: function () {
        if (!vm.newQuestion.text || !vm.newQuestion.answers.length) {
          return;
        }

        vm.newQuizz.questions.push(vm.newQuestion);
        vm.newQuestion = { text: '', answers: [] };
      },

      /*
      ** Create a new answer for the question
      */
      addAnswer: function () {
        if (!vm.newAnswer.text) { return; }
        vm.newQuestion.answers.push(vm.newAnswer);
        vm.newAnswer = { text: '', isOk: false };
      },

      /*
      ** Finally post the new quizz to the api
      */
      createQuizz: function () {
        $http.post('/api/quizzs', vm.newQuizz).then(function (res) {
          console.log(res.data);
        }, function (err) {
          console.log(err);
        });

        vm.newQuizz = { name: '', tags: [], questions: [] };
      }
    });

  });
