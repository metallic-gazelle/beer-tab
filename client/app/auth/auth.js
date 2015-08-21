var auth = angular.module('beer-tab.auth', []);

auth.controller('AuthCtrl', function ($scope, $rootScope, $window, $location, AuthService) {

  $scope.loginError = false;
  $scope.loginErrorMessage = '';

  $scope.user = {};
  $scope.logIn = function () {
    $window.username = $scope.user.username;
    AuthService.login($scope.user)
      .then(function (token) {
        $window.localStorage.setItem('com.beer-tab', token);
        $location.path('/main');
      })
      .catch(function (error) {
        console.log(error);
        $scope.loginError = true;
        $scope.loginErrorMessage = error.data;
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

  $scope.redirect = function (path) {
    console.log(path);
    $location.path('/' + path);
  };

})
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
})

.directive('passwordMatch', [function () {
  return {
    restrict: 'A',
    scope: true,
    require: 'ngModel',
    link: function (scope, elem, attrs, control) {
      var checker = function () {

        //get the value of the first password
        var e1 = scope.$eval(attrs.ngModel);

        //get the value of the other password
        var e2 = scope.$eval(attrs.passwordMatch);
        return e1 === e2;
      };
      scope.$watch(checker, function (n) {
      //set the form control to valid if both
      //passwords are the same, else invalid
        control.$setValidity('unique', n);
      });
    }
  };
}]);

