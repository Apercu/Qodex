'use strict';

angular.module('qodex')
  .controller('RoomsCtrl', function ($scope, $route, Socket, Auth) {

    var vm = this;

    angular.extend(vm, {
      name: $route.current.params.name,
      me: Auth.getUser(),
      username: '',
      nbPlayers: 0,
      messages: [],
      newMessage: '',
      sendMessage: function () {
        if (!vm.newMessage) { return; }
        Socket.emit('postMessage', { user: vm.username, msg: vm.newMessage, room: vm.name });
        vm.newMessage = '';
      }
    });

    Auth.isLoggedAsync(function () {
      vm.username = vm.me.first_name || vm.me.email.split('@')[0];
      Socket.emit('join', { room: vm.name, user: vm.username });
    });

    Socket.on('userJoin', function (data) {
      vm.nbPlayers = data.nbPlayers;
      vm.messages.push({ txt: data.user + ' has joined.', user: 'system' });
    });

    Socket.on('userLeave', function (data) {
      vm.nbPlayers--;
      vm.messages.push({ txt: data.user + ' has leaved.', user: 'system' });
    });

    Socket.on('newMessage', function (data) {
      vm.messages.push({ txt: data.msg, user: data.user });
    });

    $scope.$on('$destroy', function () {
      Socket.emit('leave', { room: vm.name, user: vm.username });
      Socket.clean();
    });

  });
