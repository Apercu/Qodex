'use strict';

angular.module('qodex')
  .service('Auth', function (
    $rootScope,
    $cookieStore,
    $q,
    $http,
    $window,
    $location,
    User) {

    var _user = {};

    if ($cookieStore.get('token')) {
      _user = User.get();
    }

    /**
     * Signup
     *
     * @param user
     * @returns {promise}
     */
    this.signup = function (user) {
      var deferred = $q.defer();
      $http.post('/api/users', user)
        .then(function (res) {
          _user = User.get();
          $cookieStore.put('token', res.data.token);
          deferred.resolve();
        })
        .catch(function (err) {
          deferred.reject(err.data);
        });
      return deferred.promise;
    };

    /**
     * Login
     *
     * @param user
     * @returns {promise}
     */
    this.login = function (user) {
      var deferred = $q.defer();
      $http.post('/auth/local', user)
        .then(function (res) {
          _user = User.get();
          $cookieStore.put('token', res.data.token);
          deferred.resolve();
        })
        .catch(function (err) {
          deferred.reject(err.data);
        });
      return deferred.promise;
    };

    /**
     * Logout
     */
    this.logout = function () {
      $cookieStore.remove('token');
      _user = {};
      $location.path('/login');
    };

    /**
     * Check if user is logged
     *
     * @returns {boolean}
     */
    this.isLogged = function () {
      return _user.hasOwnProperty('email');
    };

    /**
     * Check if user is logged asynchronously
     */
    this.isLoggedAsync = function (cb) {
      if (_user.hasOwnProperty('$promise')) {
        _user.$promise.then(function () {
          cb(true);
        }).catch(function () {
          cb(false);
        });
      } else {
        cb(false);
      }
    };

    /**
     * Returns the user
     *
     * @returns {object}
     */
    this.getUser = function () {
      return _user;
    };

    this.loginOauth = function (provider) {
      $window.location.href = '/auth/' + provider;
    };

  });
