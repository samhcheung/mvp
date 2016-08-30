var express = require('express');
var testdata = require('./testdata.json');
var request = require('request');

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

var MatchHistory = sequelize.define('matchhistory', {
  username: Sequelize.STRING,
  summonerid: Sequelize.INTEGER,
  region: Sequelize.STRING,
  matchId: Sequelize.INTEGER,
  champion: Sequelize.STRING,
  season: Sequelize.STRING,
  lane: Sequelize.STRING
});


// var Matches = sequelize.define('matches', {
//   matchId: Sequelize.INTEGER,
//   summonerid: Sequelize.INTEGER,
//   region: Sequelize.STRING,
//   matchId: Sequelize.INTEGER,
//   champion: Sequelize.STRING,
//   season: Sequelize.STRING,
//   lane: Sequelize.STRING
// });

var app = express();

app.use(express.static('public'));

var example = {"matches":[{"region":"NA","platformId":"NA1","matchId":2278377977,"champion":236,"queue":"TEAM_BUILDER_DRAFT_RANKED_5x5","season":"SEASON2016","timestamp":1472362163131,"lane":"BOTTOM","role":"DUO_CARRY"},{"region":"NA","platformId":"NA1","matchId":2261078323,"champion":104,"queue":"TEAM_BUILDER_DRAFT_RANKED_5x5","season":"SEASON2016","timestamp":1470619208409,"lane":"JUNGLE","role":"NONE"},{"region":"NA","platformId":"NA1","matchId":2242248076,"champion":104,"queue":"TEAM_BUILDER_DRAFT_RANKED_5x5","season":"SEASON2016","timestamp":1468632636746,"lane":"JUNGLE","role":"NONE"}]};

app.get('/api/users/matches', function (req, res) {
  res.json(example);
});

app.get('/api/match', function (req, res) {
  console.log(req.query);
  if(req.query.matchId === '2278377977') {
    res.json(testdata);
  } else {
    res.send();
  }
});

app.listen(1337, function () {
  console.log('Listening on port 1337');
Summoner.sync().then(function () {
  Summoner.create({
    username:'tayuku',
    summonerid: 1566
  })
  .then(function() {
    return Summoner.findAll({
      where: {
        username:'ta'
      },
      raw: true,
    });
  })
  .then(function (found) {
      console.log(found);
    });
  });


})