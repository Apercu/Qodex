'use strict';

angular.module('qodex')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/hello', {
        templateUrl: 'views/hello/hello.html',
        controller: 'HelloCtrl',
        authenticate: true,
        controllerAs: 'vm'
      });
  });
