var app = angular.module("app", []);

app.factory('UserGames', function($http) {
  var getAll = function () {
      return $http({
        method: 'GET',
        url: '/api/users/matches',
      }).then(function (resp) {
        console.log(resp.data);
        return resp.data;
      });
    };
    

  return {
    getAll:getAll
  };

});


app.controller("MyController", function($scope, UserGames) {
  $scope.something = "hi"
  $scope.foo = "blah";

  $scope.changeFoo = function () {
    $scope.matches = 'LOADING';
    UserGames.getAll().then(function(data) {
      console.log(data.matches);
      $scope.matches = data.matches;
    });
  }
});