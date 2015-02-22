'use strict';

angular.module('qodex')
  .controller('HomeCtrl', function ($scope, $location, list, $interval, $timeout) {

    var vm = this;

    $scope.ui.topBar = true;

    angular.extend(vm, {
      name: 'HomeCtrl',
      list: list,
      switchToQuizz: function (slug) {
        $location.path('/quizz/' + slug);
      }
    });

    vm.timer = null;

    vm.questions = [{
      name: 'q1',
      time: 2
    }, {
      name: 'q2',
      time: 10
    }];

    async.eachSeries(vm.questions, function (q, done) {
      vm.timer = q.time;
      vm.currentQuestion = q;
      $timeout(function () {
        vm.timer--;
        var interval = $interval(function () {
          vm.timer--;
        }, 1000);
        $timeout(function () {
          $interval.cancel(interval);
          done();
        }, q.time * 1e3 + 200);

      }, 200);
    }, angular.noop);

  });
