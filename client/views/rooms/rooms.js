'use strict';

angular.module('qodex')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/rooms/:id', {
        templateUrl: 'views/rooms/rooms.html',
        controller: 'RoomsCtrl',
        controllerAs: 'vm',
        authenticate: true
      });
  });
