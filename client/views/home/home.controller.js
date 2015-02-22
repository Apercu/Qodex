'use strict';

angular.module('qodex')
  .controller('HomeCtrl', function ($scope, $location) {

    var vm = this;

    $scope.ui.topBar = true;
    $scope.ui.white = true;

    angular.extend(vm, {
      navigateTo: function (icon) {
        $location.path(icon);
      }
    });

  });
