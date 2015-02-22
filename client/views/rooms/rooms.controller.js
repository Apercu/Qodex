'use strict';

angular.module('qodex')
  .controller('RoomsCtrl', function ($scope, $route, $timeout, $interval, $location, Socket, Auth) {

    $scope.ui.topBar = true;

    var vm = this;

    var interval;

    function answerQuestion (txt) {
      Socket.emit('respond', {
        userId: vm.me._id,
        questionId: vm.currentQuestion._id,
        answer: txt,
        room: vm.name,
        points: !txt ? 0 : ((vm.timer / vm.currentQuestion.time) * 10).toFixed(0)
      });
    }

    angular.extend(vm, {
      name: $route.current.params.name,
      me: Auth.getUser(),
      username: '',
      isLead: false,
      players: [],
      nbPlayers: 0,
      messages: [],
      newMessage: '',
      gameStarted: false,
      gameFinished: false,
      currentQuestion: {},
      timer: null,

      sendMessage: function () {
        if (!vm.newMessage) { return; }
        Socket.emit('postMessage', { user: vm.username, msg: vm.newMessage, room: vm.name });
        vm.newMessage = '';
      },
      launch: function () {
        Socket.emit('launchGame', { room: vm.name });
      },
      answer: function (a) {
        vm.currentQuestion.answered = true;
        $interval.cancel(interval);
        answerQuestion(a.text);
      }
    });

    Auth.isLoggedAsync(function () {
      vm.username = vm.me.first_name || vm.me.email.split('@')[0];
      Socket.emit('checkRoom', { room: vm.name });
    });

    Socket.on('checkRoom', function (data) {
      if (data) {
        Socket.emit('join', { room: vm.name, user: vm.username, userId: vm.me._id });
      } else {
        $location.path('/');
      }
    });

    Socket.on('userJoin', function (data) {
      vm.nbPlayers = data.players.length;
      if (vm.nbPlayers === 1) {
        vm.isLead = true;
      }
      vm.players = data.players;
      vm.messages.push({ txt: data.user + ' a rejoint.', user: 'system' });
    });

    Socket.on('userLeave', function (data) {
      vm.nbPlayers--;
      if (vm.nbPlayers === 1) {
        vm.isLead = true;
      }
      vm.players = data.players;
      vm.messages.push({ txt: data.user + ' a quitte.', user: 'system' });
    });

    Socket.on('initGame', function () {
      vm.gameStarted = true;
      vm.players.forEach(function (p) { p.played = false; });
    });

    Socket.on('nextQuestion', function (data) {
      if (vm.gameStarted) {
        vm.currentQuestion = data;
        $scope.$root.$broadcast('timer', vm.currentQuestion.time);
        vm.players.forEach(function (p) { p.played = false; });
        vm.timer = data.time;

        interval = $interval(function () {
          vm.timer--;
        }, 1e3);

        $timeout(function () {
          if (!vm.currentQuestion.answered) {
            answerQuestion(false);
          }
        }, data.time * 1e3);

        $timeout(function () {
          $interval.cancel(interval);
        }, data.time * 1e3);

      }
    });

    Socket.on('playerMove', function (id) {
      var player = vm.players[vm.players.map(function (e) { return e.id; }).indexOf(id)];
      if (player) {
        player.played = true;
      }
    });

    Socket.on('gameFinished', function () {
      vm.gameFinished = true;
    });

    Socket.on('newMessage', function (data) {
      if (vm.messages.length === 9) {
        vm.messages.splice(0, 1);
      }
      vm.messages.push({ txt: data.msg, user: data.user });
    });

    $scope.$on('$destroy', function () {
      Socket.emit('leave', { room: vm.name, user: vm.username, userId: vm.me._id });
      Socket.clean();
    });

    vm.animTimer = function (t) {
      $scope.$root.$broadcast('timer', t);
    };

  });
