'use strict';

angular.module('qodex', [
  'ngRoute',
  'ngCookies',
  'ngAnimate',
  'btford.socket-io'
])
  .config(function ($routeProvider, $locationProvider, $httpProvider) {

    $routeProvider
      .otherwise({
        redirectTo: '/'
      });

    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('authInterceptor');

  })
  .factory('authInterceptor',
  function ($rootScope, $q, $cookieStore, $location) {
    return {

      request: function (config) {
        config.headers = config.headers || {};
        if ($cookieStore.get('token')) {
          config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
        }
        return config;
      },

      responseError: function (response) {
        if (response.status === 401) {
          $location.path('/login');
          $cookieStore.remove('token');
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }

    };
  })

  .run(function ($location, $rootScope, Auth) {

    $rootScope.$on('$routeChangeStart', function (scope, route) {

      if (route.authenticate) {
        Auth.isLoggedAsync()
          .catch(function () {
            $location.path('/login');
          });
      }

    });

    $rootScope.Auth = Auth;

  });
