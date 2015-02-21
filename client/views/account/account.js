'use strict';

angular.module('qodex')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/account', {
        templateUrl: 'views/account/account.html',
        controller: 'AccountCtrl',
        controllerAs: 'vm'
      });
  });
