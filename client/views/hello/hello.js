'use strict';

angular.module('qodex')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/hello', {
        templateUrl: 'views/hello/hello.html',
        controller: 'HelloCtrl',
        authenticate: true,
        resolve: {
          user: function (Auth) {
            return Auth.getUser();
          }
        },
        controllerAs: 'vm'
      });
  });
