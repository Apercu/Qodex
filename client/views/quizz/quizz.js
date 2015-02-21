'use strict';

angular.module('qodex')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/quizz/:id', {
        templateUrl: 'views/quizz/quizz.html',
        controller: 'QuizzCtrl',
        controllerAs: 'vm',
        authenticate: true
      });
  });
