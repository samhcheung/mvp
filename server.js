var express = require('express');
var testdata = require('./testdata.json');
//console.log(typeof testdata)
//console.log(testdata.participants)

var app = express();

app.use(express.static('public'));

var example = {"matches":[{"region":"NA","platformId":"NA1","matchId":2278377977,"champion":236,"queue":"TEAM_BUILDER_DRAFT_RANKED_5x5","season":"SEASON2016","timestamp":1472362163131,"lane":"BOTTOM","role":"DUO_CARRY"},{"region":"NA","platformId":"NA1","matchId":2261078323,"champion":104,"queue":"TEAM_BUILDER_DRAFT_RANKED_5x5","season":"SEASON2016","timestamp":1470619208409,"lane":"JUNGLE","role":"NONE"},{"region":"NA","platformId":"NA1","matchId":2242248076,"champion":104,"queue":"TEAM_BUILDER_DRAFT_RANKED_5x5","season":"SEASON2016","timestamp":1468632636746,"lane":"JUNGLE","role":"NONE"}]};

app.get('/api/users/matches', function (req, res) {
  res.json(example);
});

app.get('/api/match', function (req, res) {
  res.json(testdata);
});

app.listen(1337, function () {

  console.log('Listening on port 1337');
})