'use strict';

angular.module('qodex')
  .directive('fadeWhen', function ($rootScope) {
    return {
      restrict: 'EA',
      scope: {
        toWatch: '@fadeWhen'
      },
      link: function (scope, element) {
        $rootScope.$watch(scope.toWatch, function () {
          if ($rootScope.$eval(scope.toWatch)) {
            TweenMax.to(element, .3, {
              opacity: 0
            });
          }
        });
      }
    };
  });
