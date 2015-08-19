var app = angular.module('app', ['beer-tab.auth', 'beer-tab.main', 'beer-tab.services', 'ui.router']);

app.config(function ($stateProvider, $httpProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('/login');

  $stateProvider
    .state('main', {
      url: '/main',
      templateUrl: 'app/main/main.html',
      controller: 'MainCtrl'
    })
    .state('login', {
      url: '/login',
      templateUrl: 'app/auth/login.html',
      controller: 'AuthCtrl'
    })
    .state('signup', {
      url: '/signup',
      templateUrl: 'app/auth/signup.html',
      controller: 'AuthCtrl'
    });

  $httpProvider.interceptors.push('AttachTokens');
});

app.factory('AttachTokens', function ($window) {
  // this is an $httpInterceptor
  // its job is to stop all out going request
  // then look in local storage and find the user's token
  // then add it to the header so the server can validate the request
  var attach = {
    request: function (object) {
      var jwt = $window.localStorage.getItem('com.beer-tab');
      if (jwt) {
        object.headers['x-access-token'] = jwt;
      }
      object.headers['Allow-Control-Allow-Origin'] = '*';
      return object;
    }
  };
  return attach;
});

// RUN service that authenticates all changes to url path
app.run(function ($rootScope, $location, $window, AuthService, fbAuthService) {

  $rootScope.user = {};
  // Initialize Facebook JS SDK
  $window.fbAsyncInit = function() {
    FB.init({
      appId      : '111911505825360',
      channelUrl : 'channel.html',
      cookie     : true,  // enable cookies to allow the server to access 
                          // the session
      xfbml      : true,  // parse social plugins on this page
      version    : 'v2.4' // use version 2.4
    });
  };
    // Load Facebook JS SDK
    (function(d, s, id) {
      console.log("Loading FB SDK");
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "//connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

  // Authenticate Changes to URL Path
  $rootScope.$on('$stateChangeStart', function (evt, next, current) {
    if (next.templateUrl !== 'app/auth/signup.html' && !AuthService.isAuth()) {
      $location.path('/login');
    }
  });
});
