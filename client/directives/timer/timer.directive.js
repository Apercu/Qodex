'use strict';

angular.module('qodex')
  .directive('timer', function () {
    return {
      restrict: 'EA',
      replace: true,
      templateUrl: 'directives/timer/timer.html',
      link: function (scope, element) {

        var progress = element.find('div')[0];

        scope.$on('timer', function (e, t) {
          TweenLite.killTweensOf(progress);
          TweenMax.set(progress, {
            scaleX: 1,
            ease: Linear.easeNone,
            transformOrigin: 'right'
          });
          TweenMax.to(progress, t, {
            scaleX: 0
          });
        });
      }
    };
  });
