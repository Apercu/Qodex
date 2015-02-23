'use strict';

angular.module('qodex')
  .directive('topBar', function () {
    return {
      restrict: 'EA',
      replace: true,
      templateUrl: 'directives/top-bar/top-bar.html',
      link: function () {
      }
    };
  });
