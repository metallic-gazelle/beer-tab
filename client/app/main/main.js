var main = angular.module('beer-tab.main', ['beer-tab.services', 'angular-jwt', 'ngTable']);


main.controller('MainCtrl', function ($scope, $window, beerPmt, jwtHelper, AuthService, getTable, util) {
  // Retrieve token from localStorage
  $scope.jwt = $window.localStorage.getItem('com.beer-tab');
  // Decode token (this uses angular-jwt. notice jwtHelper)
  $scope.decodedJwt = $scope.jwt && jwtHelper.decodeToken($scope.jwt);
  // Object used to contain user's beer network
  $scope.drinksSelect = {
    cocktail:   false,
    martini:    false,
    beer:       false,
    wine:       false,
    shot:       false
  };

  $scope.initializeBar = function() {
    $scope.drinksSelect = {
      cocktail:   false,
      martini:    false,
      beer:       false,
      wine:       false,
      shot:       false
    };
  };

  $scope.getDrinkClass = function(drink){
    return ($scope.drinksSelect[drink]) ? drink+'clicked' : '';
  }

  $scope.changeDrinkClass = function(drink){
    // if the drink is
    if ($scope.drinksSelect[drink]){
      $scope.drinksSelect[drink] = false;
    } else {
      $scope.initializeBar();
      $scope.drinksSelect[drink] = true;
    }
  }

  $scope.getSelectedDrink = function() {
    
    for (var drink in $scope.drinksSelect){
      if ($scope.drinksSelect[drink]){
        return drink;
      }
    }

  }

  $scope.getTable = function(){
    getTable.getTable($scope.username) 
      .then(function (derp) {
        $scope.network = util.toArr(derp);
        console.log(derp);
      });
    };


  // $scope.network =  argle || $scope.decodedJwt.network;
  // Pull username from token to display on main page
  $scope.username = $scope.decodedJwt.username;
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
      $scope.findUser = function(inputStr) {
         $scope.results = [];
        beerPmt.findUsers().then(function(data) {
            if (inputStr.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    if (data[i].name.first.toLowerCase().match(inputStr.toLowerCase()) !== null || data[i].name.last.toLowerCase().match(inputStr.toLowerCase())!==null) {
                        $scope.results.push({name: data[i].name.first +' '+data[i].name.last, username: data[i].username});
                    }
                }

            }
            console.log($scope.results);
        });
    };
    $scope.toggle = function() {
        if ($scope.clicked === false) {
            $scope.clicked = true;
        } else {
            $scope.clicked = false;
        }
    };
    $scope.clearField = function() {
        $scope.toUser = '';
        $scope.results = [];

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
