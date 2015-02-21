'use strict';

angular.module('qodex')
  .directive('sideUser', function () {
    return {
      restrict: 'EA',
      replace: true,
      templateUrl: 'directives/side-user/side-user.html',
      link: function (scope, element) {
      }
    };
  });
