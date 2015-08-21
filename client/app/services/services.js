angular.module('beer-tab.services', [])

.factory('AuthService', function ($http, $location, $window) {
  var authService = {};

  authService.login = function (credentials) {
    return $http
      .post('/api/users/login', credentials)
      .then(function (resp) {
        return resp.data.token;
      })
      .catch(function (error) {
        throw error;
      });
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
    var verdict = !!$window.localStorage.getItem('com.beer-tab-fb') || !!$window.localStorage.getItem('com.beer-tab');
    return verdict;
  };

  authService.signout = function () {
    // Remove tokens from local storage, redirect to login, reload page
    $window.localStorage.removeItem('com.beer-tab');
    $window.localStorage.removeItem('com.beer-tab-fb');
    $location.path('/login');
    setTimeout(function(){$window.location.reload()}, 500);
  };

  return authService;
})

// Factory to handle FB authentication
.factory('fbAuthService', function ($rootScope, $q, $http, $location, $window) {
  var fbAuthService = {};

  // Service that handles login/signup via facebook
  fbAuthService.useFacebook = function(path, cb){

    //return a promise that handles FB login
    var asyncLogin = function() {
      var deferred = $q.defer();

      FB.login(function(res){
        deferred.resolve(res);
      }, {scope: 'public_profile,email'});

      return deferred.promise;
    };

    //return a promise that gets user info & token
    var asyncGetUserInfo = function() {
      var deferred = $q.defer();

      var newUser = {username: null, name:{}, token: null};
      // query FB api -->
        // userId will be used as username
        // split name to get First & Last
      FB.api('/me', function(resp){
        newUser['username'] = resp.id;
        var full_name = resp.name;
        var split = full_name.split(" ");
        newUser['name']['first'] = split[0];
        newUser['name']['last']  = split[split.length-1];
      });
      FB.getLoginStatus(function(resp){
        var token = resp.authResponse.accessToken;
        newUser['token'] = token;
        deferred.resolve(newUser);
      });

      return deferred.promise;
    };
    // login async
    asyncLogin()
      .then(function(){
        // get user info
        asyncGetUserInfo()
        // post request to our api to save user to db
        .then(function(newUser){
          return $http
            .post(path, newUser)
            .then(function (resp) {
              console.log("http resp: ", resp);
              cb(resp.data);
              return resp.data;
            });
        })
      });

  };

  // Allow the user to logout of FBook from our site?
  fbAuthService.logout = function(){
    FB.logout(function(response) {
      console.log(response);
    });
  };

  return fbAuthService;
})

.factory('getTable', function ($window, $http) {

  var getTable = function (username) {
    return $http({
      method: 'POST',
      url: '/api/users/table',
      data: {username: username}
    })
    .then(function (resp) {
      console.log(resp.data);
      return resp.data;
    });
  };

  return {
    getTable: getTable,
  };
})

.factory('beerPmt', function ($window, $http) {
  var newIOU = function (user) {
    var token = $window.localStorage.getItem('com.beer-tab-fb') || $window.localStorage.getItem('com.beer-tab');
    // token = JSON.parse(token);
    console.log("token in IOU", token);
    return $http({
      method: 'POST',
      url: '/api/users/tabs',
      data: {token: token, user: user}
    })
    .then(function (resp) {
      return resp.data;
    });
  };

  var findUsers = function () {
    return $http({
      method: 'GET',
      url: 'api/users/tabs'
    })
    .then(function (resp) {
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