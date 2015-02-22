'use strict';

angular.module('qodex')
  .controller('AccountCtrl', function ($scope) {

    $scope.ui.topBar = true;
    $scope.ui.white = true;

    var vm = this;

    angular.extend(vm, {
      name: 'AccountCtrl'
    });

  });
