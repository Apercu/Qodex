'use strict';

angular.module('qodex')
  .directive('fbConnect', function (Auth, $rootScope) {
    return {
      restrict: 'EA',
      templateUrl: 'directives/fb-connect/fb-connect.html',
      link: function (scope) {
        scope.vm = {

          isConnecting: false,

          connect: function () {
            $rootScope.ui.isLogging = true;
            scope.vm.isConnecting = true;
            Auth.loginOauth('facebook');
          }

        };
      }
    };
  });
