'use strict';

// Imports
var UntappdClient = require("../node_modules/node-untappd/UntappdClient",false);
var MongoClient = require('mongodb').MongoClient;
var fs = require('fs');
var util = require('util');
var async = require('async');
var keys = require("./keys/untappd_keys");
var scrape = require("./scrape");

var ba = require('./ba_api.js');

var cheerio = require('cheerio'),
request     = require('request'),
bar         = require('./sources.js'),
bars        = bar.bars;

// Set to true if you want to see all sort of nasty output on stdout.
var debug = false;

// Create Client
var untappd = new UntappdClient(debug);
untappd.setClientId(keys.clientId);
untappd.setClientSecret(keys.clientSecret);

var query = function(collection, object){
  console.log('Querying...');
  if (object.hasOwnProperty('url')){
    collection.update( {url: object.url},
        { $set : object},
        { upsert: true })
  } else {
    collection.update( {lastUpdated: object.lastUpdated},
        { $set : object},
        { upsert: true })
  }
}

var addToCollection = function(err, beerObject, lastUpdated, cb){
  if (err) {
    console.log('Unable to add to collection');
  }else{
    MongoClient.connect("mongodb://localhost:27017/cctaps", function(err, db) {
      if(!err) {
        console.log("Adding to ", beerObject.bar);
        var collection = db.collection(beerObject.bar);
        query(collection, beerObject);
        query(collection, {lastUpdated: lastUpdated});
        db.close();
        }
    });
  }
  cb();
}

function getInfo(url, cb){
  ba.beerPage(url, function(beerInfo) {
    beerInfo = JSON.parse(beerInfo);
      cb(null, beerInfo);
  });
}

function getUrl(beerName, cb) {
  ba.beerURL(beerName, function(url) {
    cb(null, url);
  });
}

function buildObject(beer, bar, url, cb){
  var beer = beer[0];
  var dbBeer = {
    'bar' : bar,
    'brewery' : beer.brewery_name,
    'name' : beer.beer_name,
    'abv' : beer.beer_abv,
    'rating': beer.ba_score,
    'style' : beer.beer_style,
    'url': url
  }
  cb(null, dbBeer)
}

/**
 * Given a bar object containing a url, getBeers returns an
 * array of beer strings.
 */
function getBeers(bar, cb){
  console.log('getting beers for bar: ' + bar.name);
  request(bar.url, function (err, res, body) {
    var $          = cheerio.load(body),
    beers          = $(bar.css),
    beersFormatted = [],
    lastUpdated    = $('.text-oranges').text();
    lastUpdated    = lastUpdated.substring(lastUpdated.indexOf(":") + 1);
    // lastUpdated.date = theDate;
    $(beers).each(function(i, beer) {
      beersFormatted.push($(beer).text().trim());
    });
    cb(null, beersFormatted, lastUpdated);
  });
}

// function addToArray(beers){
//   var beers = []
//   $(beers).each(function (beer) {
//     // This is bm-specific. Add handler for custom css.
//     var parent_id = $(beer).closest('ul').attr('id');
//     cb(null, $(beer, bar.name).text().trim(), bar.name, serving(parent_id));
//   });
//   return
// }


function beerWaterfall(bar, beer, lastUpdated, cb){
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
    addToCollection(null, data, lastUpdated, cb);
  });
}

var processBeers = function(callback){
  async.forEach(bars, function(bar, callback){
    getBeers(bar, function(err, beers, lastUpdated) {
      async.forEach(beers, function(beer, callback){
        beerWaterfall(bar, beer, lastUpdated, function(err, res){
          callback();
        })
      }, function(err){
        callback();
      });
    });

  }, function(err){
    if (err){
      console.log('err: ' + err);
    }
  });
}

processBeers(function(err, beers){
  console.log('Beers ', beers);
})