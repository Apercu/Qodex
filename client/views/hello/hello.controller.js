'use strict';

angular.module('qodex')
  .controller('HelloCtrl', function ($timeout, $location) {
    // hack, see https://github.com/jaredhanson/passport-facebook#issues
    window.location.hash = "";
    $timeout(function () {
      $location.path('/');
    }, 2500);
  });
