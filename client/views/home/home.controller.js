'use strict';

angular.module('qodex')
  .controller('HomeCtrl', function ($scope, Socket, list) {

    var vm = this;

    Socket.emit('listRooms');

    console.log(list);

    Socket.on('listRooms', function (data) {
      console.log(data);
    });

    angular.extend(vm, {
      name: 'HomeCtrl'
    });

    $scope.$on('destroy', Socket.clean);

  });
