var main = angular.module('beer-tab.main', ['beer-tab.services', 'angular-jwt', 'ngTable']);


main.controller('MainCtrl', function ($scope, $window, beerPmt, jwtHelper, AuthService, getTable, util) {
  // Retrieve Native Token from Local Storage
  $scope.jwt = $window.localStorage.getItem('com.beer-tab');
  $scope.decodedJwt = $scope.jwt && jwtHelper.decodeToken($scope.jwt);
  
  // Retrieve FB Token from Local Storage
  $scope.fb = $window.localStorage.getItem('com.beer-tab-fb');
  $scope.fb = JSON.parse($scope.fb); 

  $scope.getTable = function(){
    console.log("Getting Table For: ", $scope.username);
    getTable.getTable($scope.username) 
      .then(function (derp) {
        $scope.network = util.toArr(derp);
        console.log(derp);
      });
    };

  // Pull username from token to display on main page
  if (!!$scope.fb){
    $scope.displayname = $scope.fb.displayname;
    $scope.username = $scope.fb.username;
  } else {
    $scope.displayname = $scope.decodedJwt.username;
    $scope.username = $scope.decodedJwt.username;
  }

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
