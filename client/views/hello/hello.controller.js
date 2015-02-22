'use strict';

angular.module('qodex')
  .controller('HelloCtrl', function ($timeout, $location) {
    $location.hash('');
    $timeout(function () {
      $location.path('/');
    }, 2500);
  });
