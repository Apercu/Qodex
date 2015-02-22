'use strict';

angular.module('qodex')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/solo', {
        templateUrl: 'views/solo/solo.html',
        controller: 'SoloCtrl',
        controllerAs: 'vm',
        authenticate: true

      });
  });
