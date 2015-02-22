'use strict';

angular.module('qodex')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/multi', {
        templateUrl: 'views/multi/multi.html',
        controller: 'MultiCtrl',
        controllerAs: 'vm',
        resolve: {
          list: function ($q, $http) {
            var deferred = $q.defer();
            $http.get('/api/quizzs').then(function (res) {
              deferred.resolve(res.data);
            }, function (err) {
              deferred.reject(err);
            });
            return deferred.promise;
          }
        }
      });
  });
