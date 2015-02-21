'use strict';

angular.module('qodex')
  .controller('HomeCtrl', function ($scope, $location, Socket, list) {

    var vm = this;

    Socket.emit('listRooms');

    Socket.on('listRooms', function (data) {
      console.log(data);
    });

    angular.extend(vm, {
      name: 'HomeCtrl',
      list: list,
      switchToQuizz: function (slug) {
        $location.path('/quizz/' + slug);
      }
    });

    $scope.$on('destroy', Socket.clean);

  });
