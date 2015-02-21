'use strict';

angular.module('qodex')
  .controller('HomeCtrl', function ($scope, $location, list) {

    var vm = this;

    angular.extend(vm, {
      name: 'HomeCtrl',
      list: list,
      switchToQuizz: function (slug) {
        $location.path('/quizz/' + slug);
      }
    });

  });
