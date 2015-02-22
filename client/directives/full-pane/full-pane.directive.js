'use strict';

angular.module('qodex')
  .directive('fullPane', function () {
    return {
      restrict: 'EA',
      transclude: true,
      templateUrl: 'directives/full-pane/full-pane.html'
    };
  });
