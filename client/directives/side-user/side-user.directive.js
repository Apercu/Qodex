'use strict';

angular.module('qodex')
  .directive('sideUser', function ($document) {
    return {
      restrict: 'EA',
      replace: true,
      templateUrl: 'directives/side-user/side-user.html',
      link: function (scope, element) {
        scope.model = {
          toggle: false
        };
        element.find('a').on('click', function () {
          scope.model.toggle = false;
          scope.$apply();
        });
        $document.on('click', function (e) {
          if (e.target === element || e.target === element.find('img')[0]) {
            return;
          }
          scope.model.toggle = false;
          scope.$apply();
        });
        document.onkeydown = function(evt) {
          evt = evt || window.event;
          if (evt.keyCode === 27) {
            scope.model.toggle = false;
            scope.$apply();
          }
        };
      }
    };
  });
