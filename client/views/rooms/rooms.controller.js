'use strict';

angular.module('qodex')
  .controller('RoomsCtrl', function ($scope, $route, Socket, Auth) {

    var vm = this;

    angular.extend(vm, {
      name: $route.current.params.name,
      me: Auth.getUser(),
      username: '',
      isLead: false,
      nbPlayers: 0,
      messages: [],
      newMessage: '',
      gameStarted: false,
      gameFinished: false,
      currentQuestion: {},

      sendMessage: function () {
        if (!vm.newMessage) { return; }
        Socket.emit('postMessage', { user: vm.username, msg: vm.newMessage, room: vm.name });
        vm.newMessage = '';
      },
      launch: function () {
        Socket.emit('launchGame', { room: vm.name });
      },
      answer: function (a) {
        console.log(a);
        Socket.emit('respond', {  });
      }
    });

    Auth.isLoggedAsync(function () {
      vm.username = vm.me.first_name || vm.me.email.split('@')[0];
      Socket.emit('checkRoom', { room: vm.name });
    });

    Socket.on('checkRoom', function (data) {
      if (data) {
        Socket.emit('join', { room: vm.name, user: vm.username, userId: vm.me._id });
      }
    });

    Socket.on('userJoin', function (data) {
      vm.nbPlayers = data.nbPlayers;
      if (vm.nbPlayers === 1) {
        vm.isLead = true;
      }
      vm.messages.push({ txt: data.user + ' a rejoint.', user: 'system' });
    });

    Socket.on('userLeave', function (data) {
      vm.nbPlayers--;
      if (vm.nbPlayers === 1) {
        vm.isLead = true;
      }
      vm.messages.push({ txt: data.user + ' a quitte.', user: 'system' });
    });

    Socket.on('initGame', function () {
      vm.gameStarted = true;
    });

    Socket.on('nextQuestion', function (data) {
      if (vm.gameStarted) {
        console.log(data)
        vm.currentQuestion = data;
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

  });
