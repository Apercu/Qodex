'use strict';

angular.module('qodex')
  .directive('fbConnect', function (Auth, $rootScope) {
    return {
      restrict: 'EA',
      templateUrl: 'directives/fb-connect/fb-connect.html',
      link: function (scope) {
        scope.model = {

          isConnecting: false,

          connect: function () {
            $rootScope.ui.isLogging = true;
            scope.model.isConnecting = true;
            Auth.loginOauth('facebook');
          }

        };
      }
    };
  });
