var express = require('express');
var testdata = require('./testdata.json');
var request = require('request');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/league');


var API = 'RGAPI-972540E0-65C9-410F-B069-EB5CDE1D616B';

var Matches = mongoose.model('Matches', { matchId: String, match: Object });


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
  matchId: Sequelize.STRING,
  champion: Sequelize.STRING,
  season: Sequelize.STRING,
  lane: Sequelize.STRING,
  timestamp: Sequelize.STRING
});



var app = express();

app.use(express.static('public'));

var example = {"matches":[{"region":"NA","platformId":"NA1","matchId":2278377977,"champion":236,"queue":"TEAM_BUILDER_DRAFT_RANKED_5x5","season":"SEASON2016","timestamp":1472362163131,"lane":"BOTTOM","role":"DUO_CARRY"},{"region":"NA","platformId":"NA1","matchId":2261078323,"champion":104,"queue":"TEAM_BUILDER_DRAFT_RANKED_5x5","season":"SEASON2016","timestamp":1470619208409,"lane":"JUNGLE","role":"NONE"},{"region":"NA","platformId":"NA1","matchId":2242248076,"champion":104,"queue":"TEAM_BUILDER_DRAFT_RANKED_5x5","season":"SEASON2016","timestamp":1468632636746,"lane":"JUNGLE","role":"NONE"}]};

app.get('/api/users/matches', function (req, response) {
  console.log('get username', req.query.username);
  var matchhistory = {};
  if(req.query.username.length > 0) {
    

    MatchHistory.findAll({
      where: {username: req.query.username.toLowerCase()},
      raw: true
    })
    .then(function(found) {
      if(found.length != 0) {
        console.log('found the specific match', found[0]);
        response.json({matches: found});
      } else {
        request('https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/' 
          + req.query.username + '?api_key=' + API, function (err, res, body) {
            if(err) {console.log('Error on request getting user id', err); return;}
            if(!err && res.statusCode != 400 && res.statusCode != 404) {
              console.log('GET REQUEST summonerid');
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
                  console.log(res.statusCode,'statusCode');

                  console.log('GET REQUEST matchhistory');
                  matchhistory = JSON.parse(body);
                  //console.log( typeof matchhistory.matches, matchhistory.matches[5]);
                  matchhistory.matches.forEach(function (item) {
                    MatchHistory.findOrCreate({
                      where : {
                        username: req.query.username.toLowerCase(),
                        summonerid: id,
                        region: item.region,
                        matchId: item.matchId,
                        champion: item.champion,
                        season: item.season,
                        lane: item.lane,
                        timestamp: item.timestamp
                      },
                      defaults: {
                        username: req.query.username.toLowerCase(),
                        summonerid: id,
                        region: item.region,
                        matchId: item.matchId,
                        champion: item.champion,
                        season: item.season,
                        lane: item.lane,
                        timestampe: item.timestamp
                      }

                    });


                  })


                  response.json(matchhistory);
                });
            } // if !err
          }); // request

        
      } //else found
    }); //then


  } else {
    response.json({"matches":[]})
  }

});

app.get('/api/match', function (req, response) {
  console.log(req.query);
  Matches.find({matchId: '' + req.query.matchId}, function(err,data) {
    if(data.length > 0) {
      console.log('Found stored match', req.query.matchId);
      //console.log(JSON.parse(data[0].match));
      response.json(data[0].match);
    } else {
    request('https://na.api.pvp.net/api/lol/na/v2.2/match/' +
      req.query.matchId + '?api_key=' + API, function(err,res,body) {
        //console.log('Fetching match', body);
        var parsedmatch = JSON.parse(body);
        var match = new Matches({ matchId: req.query.matchId, match: parsedmatch })
        match.save().then(function() {
          console.log('Saved fetched match in db')
          response.json(parsedmatch);
        });
      });
      
    }
  });

});

app.listen(1337, function () {
  console.log('Listening on port 1337');
  // var match = new Matches({ matchId: 12345, match: testdata })
  // match.save();

  // Matches.find({matchId: "12345"}, function (err, data) {
  //   console.log(data);
  // });

  Summoner.sync()
  .then(function () {
    console.log('Summoner table ready');
    MatchHistory.sync()
    .then(function () {
      console.log('MatchHistory table ready');
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