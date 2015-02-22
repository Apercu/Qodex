'use strict';

angular.module('qodex')
  .controller('MultiCtrl', function ($scope, list, $location) {

    var vm = this;

    $scope.ui.white = true;
    $scope.ui.topBar = true;

    vm.list = list;
    vm.navigateTo = function (oentuh) {
      $location.path('/quizz/' + oentuh);
    };

  });
