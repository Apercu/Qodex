'use strict';

angular.module('qodex')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/admin', {
        templateUrl: 'views/admin/admin.html',
        controller: 'AdminCtrl',
        controllerAs: 'vm',
        authenticate: true
      });
  });
