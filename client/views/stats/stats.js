'use strict';

angular.module('qodex')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/stats', {
        templateUrl: 'views/stats/stats.html',
        controller: 'StatsCtrl',
        controllerAs: 'vm',
        authenticate: true
      });
  });
