'use strict';

angular.module('qodex')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/quizz/:id', {
        templateUrl: 'views/quizz/quizz.html',
        controller: 'QuizzCtrl',
        controllerAs: 'vm',
        authenticate: true,
        resolve: {
          quizz: function ($q, $http, $route, $location) {
            var def = $q.defer();
            $http.get('/api/quizzs/check/' + $route.current.params.id)
              .then(function (res) {
                def.resolve(res.data);
              }, function (err) {
                def.reject(err);
                $location.path('/');
              });
            return def.promise;
          }
        }
      });
  });
