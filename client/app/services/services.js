angular.module('beer-tab.services', [])

.factory('AuthService', function ($http, $location, $window) {
  var authService = {};
 
  authService.login = function (credentials) {
    return $http
      .post('/api/users/login', credentials)
      .then(function (resp) {
        return resp.data.token;
      });
  };
 
  authService.signup = function(credentials) {
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
.factory('fbAuthService', function ($http, $location, $window) {
  var fbAuthService = {};

  fbAuthService.login = function(credentials){

  };

  fbAuthService.signup = function(credentials){

  };

  fbAuthService.checkLoginStatus = function(){
    FB.getLoginStatus(function(res){
      console.log("Token: " + res.authResponse.accessToken);
      handleLoginStatus(res);
    });
  };

  fbAuthService.handleLoginStatus = function(res){
    // var _self = this;

    if (res.status === 'connected'){
      console.log("User logged into app and facebook");
      getUserInfo();
    } else {
      console.log("User not logged in");
    }

  };

  fbAuthService.watchLoginStatus = function(){
    var _self = this;

    FB.Event.subscribe('auth.authResponseChange', function(res) {

      if (res.status === 'connected') {
        console.log("User connected");
        _self.getUserInfo();
      } 
      else {
        console.log("Not logged in");
      }

    });
  };


  fbAuthService.getUserInfo = function() {
    var _self = this;

    FB.api('/me', function(res) {
      $rootScope.$apply(function() {
        console.log("Successful Login: " + res)
        $rootScope.user = res; 
      });
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
      //console.log(resp.data);
        return resp.data;
    });
  };

  return {
    newIOU: newIOU,
  };
})
.factory('util', function(){
  var helper = {};
  
  helper.toArr = function (obj){
    var temp = [];
    for(var key in obj){
      temp.push({
        username: key,
        tab: obj[key]
      });
    }
    return temp;
  };

  return helper;
});



