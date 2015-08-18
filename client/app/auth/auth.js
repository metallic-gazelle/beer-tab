var auth = angular.module('beer-tab.auth', []);

auth.controller('AuthCtrl', function ($scope, $rootScope, $window, $location, AuthService, fbAuthService) {
  
  $scope.user = {};
  $scope.logIn = function () {
    console.log("In legacy logIn");
    $window.username = $scope.user.username;
    AuthService.login($scope.user)
      .then(function (token) {
        $window.localStorage.setItem('com.beer-tab', token);
        $location.path('/main');
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  $scope.signUp = function () {
    AuthService.signup($scope.user)
      .then(function (token) {
        $window.localStorage.setItem('com.beer-tab', token);
        $location.path('/main');
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  $scope.signout = function () {
    AuthService.signout();
  };

  //FACEBOOK AUTHENTICATION
  $scope.fbLogIn = function() {
    console.log("in FB login");
    FB.login(function(res){
      fbAuthService.handleLoginStatus(res);
    })
    fbAuthService.checkLoginStatus();
  };

  $scope.fbSignUp = function() {

  };

  $scope.fbLogOut = function(){

  };

});
