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
  var getMatch = function (matchId) {
    return $http({
      method: 'GET',
      url: '/api/match',
      params: {matchId: matchId},
    }).then(function (resp) {
      console.log(resp.data);
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
  $scope.foo = "blah";

  $scope.changeFoo = function () {
    $scope.matches = 'LOADING';

    UserGames.getAll().then(function(data) {
      console.log(data.matches);
      $scope.matches = data.matches;
    });
  }

  $scope.showmatch = function (matchId) {
    console.log(matchId);
    UserGames.getMatch(matchId).then(function(data) {
      console.log(data.participantIdentities);
      $scope.participantIds = $scope.participantIds || {};
      $scope.participantIds[matchId] = data.participantIdentities;
    });
  }


});