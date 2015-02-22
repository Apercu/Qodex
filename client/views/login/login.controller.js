'use strict';

angular.module('qodex')
  .controller('LoginCtrl', function ($scope) {

    var vm = this;

    $scope.ui.topBar = false;
    $scope.ui.white = false;

    vm.shadowIndex = 0;

    var textes = [
      'login en tant qu\'invité',
      'etes-vous sur ?',
      'vraiment sur ?'
    ];

    vm.getShadowText = function () {
      return textes[vm.shadowIndex];
    };

    vm.incrementShadow = function () {
      vm.shadowIndex++;
    };
  });
