var auth = angular.module('beer-tab.auth', []);

auth.controller('AuthCtrl', function ($scope, $rootScope, $window, $location, AuthService, fbAuthService, $q) {
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

  $scope.redirect = function(path) {
    console.log(path);
    $location.path('/' + path);
  };
  
  // FACEBOOK AUTHENTICATION
  $scope.fbLogIn = function() {
    var waitForLogin = function() {
      var deferred = $q.defer();
      fbAuthService.useFacebook('/api/users/login', function(resp){
        deferred.resolve(resp);
      });
      return deferred.promise;
    };
    waitForLogin()
      .then(function (token){
        console.log("Response from backend: ", token);
        $window.localStorage.setItem('com.beer-tab', JSON.stringify(token));
        $location.path('/main');
      })
  };

  $scope.fbSignUp = function() {
    var waitForSignup = function() {
      var deferred = $q.defer();
      fbAuthService.useFacebook('/api/users/signup', function(resp){
        deferred.resolve(resp);
      });
      return deferred.promise;
    };
    waitForSignup()
      .then(function (token){
        console.log("Response from backend: ", token);
        $window.localStorage.setItem('com.beer-tab', JSON.stringify(token));
        $location.path('/main');
      });
  };

  $scope.fbLogOut = function(){
    fbAuthService.logout();
  };

})

// attribute directive for requiring checkbox on 21 and up and Terms of Service
// https://medium.com/@MohanKethees/quick-angularjs-checkbox-validation-a1ade60a97f4
.directive('checkRequired', function () {
  return {
    require: 'ngModel',
    restrict: 'A',
    link: function (scope, element, attrs, ngModel) {
      ngModel.$validators.checkRequired = function (modelValue, viewValue) {
        var value = modelValue || viewValue;
        var match = scope.$eval(attrs.ngTrueValue) || true;
        return value && match === value;
      };
    }
  };
});
