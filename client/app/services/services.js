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

// Factory to handle FB authentication
.factory('fbAuthService', function ($rootScope, $q, $http, $location, $window) {
  var fbAuthService = {};

  // Service that either logs in or signs up w/ facebook
  // depending on path
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
      // query FB api -->
        // userId will be used as username
        // split name to get First & Last
      .then(function(){
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

  fbAuthService.logout = function(){
    var _self = this;

    FB.logout(function(response) {
      console.log(response);
      $rootScope.$apply(function() { 
        $rootScope.user = _self.user = {}; 
      }); 
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
