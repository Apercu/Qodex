'use strict';

angular.module('qodex')
  .controller('QuizzCtrl', function ($scope, $location, quizz, Socket) {

    var vm = this;

    $scope.ui.topBar = true;
    $scope.ui.white = true;

    Socket.emit('listRooms');

    Socket.on('listRooms', function (data) {
      data.forEach(function (room) {
        if (room.quizz === vm.quizz._id) {
          vm.rooms.push(room);
        }
      });
    });

    angular.extend(vm, {
      name: 'aoeu' + new Date().getTime(),
      quizz: quizz,
      rooms: [],
      createRoom: function () {
        if (!vm.name) { return; }
        Socket.emit('createRoom', { name: vm.name, quizzId: vm.quizz._id });
        Socket.on('roomCreated', function (data) {
          if (data.err === 'already') {
            vm.name = '';
            alert('Ce nom existe deja, veuillez en choisir un autre.');
          } else {
            $location.path('/rooms/' + data.id);
          }
        });
      },
      switchRoom: function (id) {
        $location.path('/rooms/' + id);
      }
    });

    Socket.on('newRoom', function (data) {
      if (data.quizz === vm.quizz._id) {
        vm.rooms.push(data);
      }
    });

    Socket.on('removeRoom', function (data) {
      var index = vm.rooms.map(function (e) { return e.id; }).indexOf(data.id);
      if (index !== -1) {
        vm.rooms.splice(index, 1);
      }
    });

    $scope.$on('$destroy', Socket.clean);

  });
