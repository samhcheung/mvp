var express = require('express');
var testdata = require('./testdata.json');
var request = require('request');

var API = 'RGAPI-972540E0-65C9-410F-B069-EB5CDE1D616B';


var Sequelize = require('sequelize');
var sequelize = new Sequelize('league', 'root', 'hr', {
  host: 'localhost',
  dialect: 'mysql',
  port: 3306,
  logging: false
});

var Summoner = sequelize.define('summoners', {
  username: Sequelize.STRING,
  summonerid: Sequelize.INTEGER
});

var MatchHistory = sequelize.define('matchhistories', {
  username: Sequelize.STRING,
  summonerid: Sequelize.INTEGER,
  region: Sequelize.STRING,
  matchId: Sequelize.INTEGER,
  champion: Sequelize.STRING,
  season: Sequelize.STRING,
  lane: Sequelize.STRING
});


var Matches = sequelize.define('matches', {
  matchId: Sequelize.INTEGER,
  summonerid: Sequelize.INTEGER,
  region: Sequelize.STRING,
  matchId: Sequelize.INTEGER,
  champion: Sequelize.STRING,
  season: Sequelize.STRING,
  lane: Sequelize.STRING
});

var app = express();

app.use(express.static('public'));

var example = {"matches":[{"region":"NA","platformId":"NA1","matchId":2278377977,"champion":236,"queue":"TEAM_BUILDER_DRAFT_RANKED_5x5","season":"SEASON2016","timestamp":1472362163131,"lane":"BOTTOM","role":"DUO_CARRY"},{"region":"NA","platformId":"NA1","matchId":2261078323,"champion":104,"queue":"TEAM_BUILDER_DRAFT_RANKED_5x5","season":"SEASON2016","timestamp":1470619208409,"lane":"JUNGLE","role":"NONE"},{"region":"NA","platformId":"NA1","matchId":2242248076,"champion":104,"queue":"TEAM_BUILDER_DRAFT_RANKED_5x5","season":"SEASON2016","timestamp":1468632636746,"lane":"JUNGLE","role":"NONE"}]};

app.get('/api/users/matches', function (req, response) {
  console.log('get username', req.query.username);
  var matchhistory = {};
  if(req.query.username.length > 0) {
    request('https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/' 
      + req.query.username + '?api_key=' + API, function (err, res, body) {
        if(err) {console.log('Error on request getting user id', err); return;}
        if(!err && res.statusCode != 400 && res.statusCode != 404) {
          console.log(body);
          parsedBody = JSON.parse(body);
          var innerObj = parsedBody[req.query.username.toLowerCase()];
          var id = innerObj.id;
          Summoner.findOrCreate({
            where : {username: req.query.username.toLowerCase(),
            summonerid: id},
            defaults: {username: req.query.username.toLowerCase(),
            summonerid: id}
          });
          request('https://na.api.pvp.net/api/lol/na/v2.2/matchlist/by-summoner/' +
            id +'?seasons=SEASON2016&api_key=' + API, function (err,res, body) {
              //console.log(body, 'matchhistory');
              matchhistory = JSON.parse(body);
              for(var i = 0; i < matchhistory.matches.length; i++) {
                MatchHistory.findOrCreate({
                  where : {
                    username: req.query.username.toLowerCase(),
                    summonerid: id,
                    region: matchhistory.matches[i].region,
                    matchId: matchhistory.matches[i].matchId,
                    champion: matchhistory.matches[i].champion,
                    season: matchhistory.matches[i].season,
                    lane: matchhistory.matches[i].lane
                  },
                  defaults: {
                    username: req.query.username.toLowerCase(),
                    summonerid: id,
                    region: matchhistory.matches[i].region,
                    matchId: matchhistory.matches[i].matchId,
                    champion: matchhistory.matches[i].champion,
                    season: matchhistory.matches[i].season,
                    lane: matchhistory.matches[i].lane
                  }
                });
              } // for loop

              response.json(matchhistory);
            });
        } // if !err
      }); // request

  } else {
    response.json({"matches":[]})
  }

});

app.get('/api/match', function (req, response) {
  console.log(req.query);
  // if(req.query.matchId === '2278377977') {
  //   res.json(testdata);
  // } else {
  //   res.send();
  // }
  request('https://na.api.pvp.net/api/lol/na/v2.2/match/' +
    req.query.matchId + '?api_key=' + API, function(err,res,body) {
      var parsedmatch = JSON.parse(body);
      response.json(parsedmatch);
    });

});

app.listen(1337, function () {
  console.log('Listening on port 1337');
  Summoner.sync()
  .then(function () {
    console.log('Summoner table ready');
    MatchHistory.sync()
    .then(function () {
      console.log('MatchHistory table ready');
      Matches.sync().then(function() {
        console.log('Matches table ready');
      });
    })
  });

// .then(function () {
//   Summoner.create({
//     username:'tayuku',
//     summonerid: 1566
//   })
//   .then(function() {
//     return Summoner.findAll({
//       where: {
//         username:'ta'
//       },
//       raw: true,
//     });
//   })
//   .then(function (found) {
//       console.log(found);
//     });
//   });


})