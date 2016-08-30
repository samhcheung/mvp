var app = angular.module("app", []);

app.factory('UserGames', function($http) {
  var getAll = function (username) {
      return $http({
        method: 'GET',
        url: '/api/users/matches',
        params: {username: username}
      }).then(function (resp) {
        console.log(resp.data);
        return resp.data;
      });
    };
  var getMatch = function (matchId) {
    return $http({
      method: 'GET',
      url: '/api/match',
      params: {matchId: matchId},
    }).then(function (resp) {
      //console.log(resp.data);
      return resp.data;
    });    
  }


  return {
    getAll:getAll,
    getMatch:getMatch
  };

});


app.controller("MyController", function($scope, UserGames) {
  $scope.something = "button"
  $scope.searchInput = "";

  $scope.changeFoo = function () {
    console.log($scope.searchInput);

    UserGames.getAll($scope.searchInput).then(function(data) {
      console.log(data.matches);
      $scope.matches = data.matches.slice(0,15);
    });
  }

  $scope.showmatch = function (matchId) {
    console.log(matchId);
    UserGames.getMatch(matchId).then(function(data) {
      // console.log(data.participantIdentities);
      $scope.data = $scope.data || {};
      
      $scope.data[matchId] = data;
    });
  }


});

app.controller("PlayerController", function($scope) {

  console.log($scope.participantId);
})