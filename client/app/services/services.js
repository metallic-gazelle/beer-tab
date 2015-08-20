angular.module('beer-tab.services', [])

.factory('AuthService', function ($http, $location, $window) {
  var authService = {};

  authService.login = function (credentials) {
    return $http
      .post('/api/users/login', credentials)
      .then(function (resp) {
        return resp.data.token;
      })
      .catch(function(err){
        throw err;
      })
  };

  authService.signup = function (credentials) {
    console.log('cred:', credentials);
    return $http
      .post('/api/users/signup', credentials)
      .then(function (resp) {
        return resp.data.token;
      });
  };

  authService.isAuth = function () {
    return !!$window.localStorage.getItem('com.beer-tab');
  };

  authService.signout = function () {
    $window.localStorage.removeItem('com.beer-tab');
    $location.path('/login');
  };

  return authService;
})

.factory('getTable', function ($window, $http) {
  var getTable = function (username) {
    return $http({
      method: 'POST',
      url: '/api/users/table',
      data: {username: username}
    })
    .then(function (resp) {
      //console.log(resp.data);
      return resp.data;
    });
  };

  return {
    getTable: getTable,
  };
})

.factory('beerPmt', function ($window, $http) {
  var newIOU = function (user) {
    return $http({
      method: 'POST',
      url: '/api/users/tabs',
      data: {token: $window.localStorage.getItem('com.beer-tab'), user: user}
    })
    .then(function (resp) {
      return resp.data;
    });
  };
    var findUsers = function(){
    return $http({
      method: 'GET',
      url: 'api/users/tabs'
    })
    .then(function(resp){
      console.log(resp.data);
      return resp.data;
    });
  };

  return {
    newIOU: newIOU,
    findUsers: findUsers
  };
})

.factory('util', function () {
  var helper = {};

  helper.toArr = function (obj) {
    var temp = [];
    for (var key in obj) {
      temp.push({
        username: key,
        tab: obj[key]
      });
    }
    return temp;
  };

  return helper;
});
