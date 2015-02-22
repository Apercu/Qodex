'use strict';

angular.module('qodex')
  .controller('AccountCtrl', function ($scope, Auth) {

    $scope.ui.topBar = true;
    $scope.ui.white = true;

    var vm = this;

    angular.extend(vm, {
      username: '',
      points: 0,
      rank: {}
    });

    Auth.getUser().$promise.then(function (res) {
      vm.rank = res.rank;
      vm.points = res.points;
      vm.username = res.facebook.first_name || res.email.split('@')[0];
    });

  });
