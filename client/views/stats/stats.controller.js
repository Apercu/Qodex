'use strict';

angular.module('qodex')
  .controller('StatsCtrl', function ($scope, users) {

    var vm = this;

    $scope.ui.topBar = true;
    $scope.ui.white = true;

    angular.extend(vm, {
      users: users
    });

  });
