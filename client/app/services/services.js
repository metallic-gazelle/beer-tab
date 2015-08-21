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

  fbAuthService.login = function(){
    //return a promise that handles FB login
    var asyncLogin = function() {
      var deferred = $q.defer();

      FB.login(function(res){
        deferred.resolve(res);
      }, {scope: 'public_profile,email'});

      return deferred.promise;
    };

    // login async
    asyncLogin();
    
  };

  fbAuthService.signup = function(){

    // user object that will be populated by
    // facebook login
    var newUser = {username: null, name:{}, token: null};

    //return a promise that handles FB login
    var asyncLogin = function() {
      var deferred = $q.defer();

      FB.login(function(res){
        deferred.resolve(res);
      }, {scope: 'public_profile,email'});

      return deferred.promise;
    };

    // login async
    asyncLogin()
      // query FB api -->
        // userId will be used as username
        // split name to get First & Last
      .then(function(){
        FB.api('/me', function(resp){
          newUser['username'] = resp.id;
          var full_name = resp.name;
          var split = full_name.split(" ");
          newUser['name']['first'] = split[0];
          newUser['name']['last']  = split[split.length-1];
        });
      })
      // getLoginStatus provides access to token,
      // attach to newUser object as well
      .then(function(){
        FB.getLoginStatus(function(resp){
          var token = resp.authResponse.accessToken;
          newUser['token'] = token;
          console.log(newUser);
        })
      })
      // post request to our api to save user to db
      .then(function(){
        return $http
          .post('/api/users/signup', newUser)
          .then(function (resp) {
            return resp.data.token;
          });
      })
  };

  // fbAuthService.handleLoginStatus = function(res){

  //   if (res.status === 'connected'){
  //     console.log("User logged into app and facebook");
  //     fbAuthService.getUserInfo();
  //   } else {
  //     console.log("User not logged in");
  //   }

  // };

  // fbAuthService.getUserInfo = function() {
  //   var _self = this;

  //   FB.api('/me', function(res) {
  //     // $rootScope.$apply(function() {
  //       console.log("Successful Login: " + res);
  //       $rootScope.user = res; 
  //       console.log("rootScope: " + $rootScope);
  //     // });
  //   });
  // };

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
