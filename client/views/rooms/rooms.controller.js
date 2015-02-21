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
      sendMessage: function () {
        if (!vm.newMessage) { return; }
        Socket.emit('postMessage', { user: vm.username, msg: vm.newMessage, room: vm.name });
        vm.newMessage = '';
      },
      launch: function () {

      }
    });

    Auth.isLoggedAsync(function () {
      vm.username = vm.me.first_name || vm.me.email.split('@')[0];
      Socket.emit('join', { room: vm.name, user: vm.username });
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

    Socket.on('newMessage', function (data) {
      if (vm.messages.length === 9) {
        vm.messages.splice(0, 1);
      }
      vm.messages.push({ txt: data.msg, user: data.user });
    });

    $scope.$on('$destroy', function () {
      Socket.emit('leave', { room: vm.name, user: vm.username });
      Socket.clean();
    });

  });
