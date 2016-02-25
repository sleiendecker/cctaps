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

var addToCollection = function(err, data){
  if (err) {
    console.log('Unable to add to collection');
  }else{
    MongoClient.connect("mongodb://localhost:27017/cctaps", function(err, db) {
      if(!err) {
        console.log("We are connected");
        var collection = db.collection("beers");
        collection.insert(data);
        db.close();
        }
    });
  }
}

function getInfo(url, cb){
  ba.beerPage(url, function(beerInfo) {
    beerInfo = JSON.parse(beerInfo);
      cb(null, beerInfo);
  });
}

function getUrl(beerName, cb) {
  ba.beerURL(beerName, function(url) {
    // console.log(beerName + ' url: ' + url);
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

function serving(type){
  if (typeof type === 'undefined'){
    // if serving type isn't specific, assign on_tap
    return 'on_tap';
  }
  return type;
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
    beersFormatted = [];

    $(beers).each(function(i, beer) {
      beersFormatted.push($(beer).text().trim());
    });
    console.log('Found beers:\n' + beersFormatted);
    cb(null, beersFormatted);
  });
}

function getServing(err, bar, beers, cb){
  cb(null, bar, body(beer, bar).text().trim(), serving(parent_id));
}

function addToArray(beers){
  var beers = []
  $(beers).each(function (beer) {
    // This is bm-specific. Add handler for custom css.
    var parent_id = $(beer).closest('ul').attr('id');
    cb(null, $(beer, bar.name).text().trim(), bar.name, serving(parent_id));
  });
  return
}


function beerWaterfall(beer, cb){
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
    console.log('Adding ' + JSON.stringify(data) + ' to collection');
    addToCollection(null, data);
    cb();
  });
}

var processBeers = function(callback){
  async.forEach(bars, function(bar, callback){
    getBeers(bar, function(err, beers) {
      async.forEach(beers, function(beer, callback){
        console.log('Evaluating beer: ' + beer);
        beerWaterfall(beer, function(err, res){
          callback();
        })
      }, function(err){
        console.log('All processed');
        callback();
      });
    });
  }, function(err){
    console.log('err');
  });
}

processBeers(function(err, beers){
  console.log('Beers ', beers);
})