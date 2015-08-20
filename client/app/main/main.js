var main = angular.module('beer-tab.main', ['beer-tab.services', 'angular-jwt', 'ngTable']);


main.controller('MainCtrl', function ($scope, $window, beerPmt, jwtHelper, AuthService, getTable, util) {
  // Retrieve token from localStorage
  $scope.jwt = $window.localStorage.getItem('com.beer-tab');
  var tempToken = JSON.parse($scope.jwt);
  console.log("tempToken", tempToken);
  // Decode token (this uses angular-jwt. notice jwtHelper)
  $scope.decodedJwt = $scope.jwt && jwtHelper.decodeToken($scope.jwt);
  if (!!tempToken.hasOwnProperty('fb')){
    console.log("Has fbToken");
    $scope.decodedJwt = tempToken;
  }
  // Object used to contain user's beer network
  

  $scope.getTable = function(){
    getTable.getTable($scope.username) 
      .then(function (derp) {
        $scope.network = util.toArr(derp);
        console.log(derp);
      });
    };


  // $scope.network =  argle || $scope.decodedJwt.network;
  // Pull username from token to display on main page
  $scope.displayname = $scope.decodedJwt.displayname || $scope.decodedJwt.username;
  $scope.username = tempToken.username || $scope.decodedJwt.username;
  /*console.log('$scope.username', $scope.username);*/


  //this is used to show the add friend button, and hide the
  // new friend form
  $scope.clicked = false;
  /*$scope.network = [];*/
  
  //This function sends a request to the server, it returns 
  //the updated information
  $scope.sendBeer = function (user) {
    
    if(user){
      console.log('sendBeer called', user);
      
      if(AuthService.isAuth()) {
        beerPmt.newIOU(user)
        .then(function(derp){
          console.log(derp); 
          $scope.network = util.toArr(derp.network);
          
        });
      }
    }
  };
});

main.filter('range', function() {
  return function(input, total) {
    total = Math.abs(parseInt(total));
    for (var i=0; i<total; i++)
      input.push(i);
    return input;
  };
});
