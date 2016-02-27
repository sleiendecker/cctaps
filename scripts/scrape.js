'use strict';

// Dependencies
var async = require('async'),
cheerio   = require('cheerio'),
request   = require('request'),
ba        = require('./ba_api.js');

var mongoScripts = require('./mongo'),
MongoServer      = mongoScripts.MongoServer,
MongoClient      = mongoScripts.MongoClient,
connectToDb      = mongoScripts.connectToDb,
checkIfBarExists = mongoScripts.checkIfBarExists,
checkLastUpdated = mongoScripts.checkLastUpdated,
ObjectID         = require('mongodb').ObjectID;

var parseDate = function(date){
  var removedDate  = date.substring(date.indexOf(":") + 1),
  parsedDate = removedDate.substring(0, removedDate.indexOf('|'));
  return parsedDate
}

var getUrl = function(beerName, cb) {
  ba.beerURL(beerName, function(url) {
    cb(null, url);
  });
}

var getInfo = function(url, cb){
  ba.beerPage(url, function(beerInfo) {
    beerInfo = JSON.parse(beerInfo);
      cb(null, beerInfo);
  });
}

function buildObject(beer, bar, url, cb){
  var beer = beer[0];
  var dbBeer = {
    _id: new ObjectID,
    bar : bar,
    brewery : beer.brewery_name,
    name : beer.beer_name,
    abv : beer.beer_abv,
    rating: beer.ba_score,
    style : beer.beer_style,
    url: url
  }
  cb(null, dbBeer)
}

module.exports = {
  /**
   * Given a bar object containing a url, getBeers returns an
   * array of beer strings.
   */
  getBeers: function(bar, cb){
    var newBar;
    console.log('getting beers for bar: ' + bar.name);
    request(bar.url, function (err, res, body) {
      var $             = cheerio.load(body),
      beers             = $(bar.css),
      beersFormatted    = [],
      rawUpdated        = $('.pure-u-1-2 span').text();

      bar.lastUpdated   = parseDate(rawUpdated);
      $(beers).each(function(i, beer) {
        beersFormatted.push($(beer).text().trim());
      });

      console.log('rawUpdated: ', rawUpdated);
      // console.log('bar.lastUpdated: ', bar.lastUpdated);
      var dbBar = {
        name: bar.name,
        lastUpdated: bar.lastUpdated,
        beers: []
      }

      MongoClient.connect(MongoServer, function(err, db) {
        console.log('searching for bar: ', dbBar);
        checkIfBarExists(dbBar, db, function(status) {
          // console.log('dat status: ', status);
          // If the bar doesn't exist in the db
          if (status === null){
            newBar = true;
            var collection = db.collection("bars");
            collection.insert(dbBar);
          }
          db.close();
        });
      });

      MongoClient.connect(MongoServer, function(err, db) {
        console.log('should be second');
        checkLastUpdated(bar, db, newBar, function(res) {
          db.close();
          if (res){
            console.log('Up to date');
          } else{
            console.log('Updating')
            cb(null, beersFormatted, bar.lastUpdated);
          }
        });
      });
    });
  },

  beerWaterfall: function(bar, beer, lastUpdated, cb){
    async.waterfall([
      function(callback){
        console.log('Getting url');
        getUrl(beer, function(err, url){
          callback(err, url);
        });
      },
      function(url, callback){
        console.log('Getting info');
        getInfo(url, function(err, beerInfo){
          callback(err, beerInfo, url);
        })
      },
      function(beerInfo, url, callback){
        console.log('Building object');
        buildObject(beerInfo, bar.name, url, function (err, dbBeer) {
          callback(err, dbBeer);
        })
      }
    ],
    function(err, data){
      connectToDb(null, data, lastUpdated, cb);
    });
  }
}