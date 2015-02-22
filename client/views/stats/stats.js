'use strict';

angular.module('qodex')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/stats', {
        templateUrl: 'views/stats/stats.html',
        controller: 'StatsCtrl',
        controllerAs: 'vm',
        authenticate: true,
        resolve: {
          users: function ($q, $http) {
            var def = $q.defer();
            $http.get('/api/users').then(function (res) {
              def.resolve(res.data);
            }, function (err) {
              def.reject(err);
            });
            return def.promise;
          }
        }
      });
  });
