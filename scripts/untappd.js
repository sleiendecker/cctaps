'use strict';

// Imports
var UntappdClient = require("../node_modules/node-untappd/UntappdClient",false);
var MongoClient = require('mongodb').MongoClient;
var MongoServer = "mongodb://localhost:27017/cctaps";
var ObjectID = require('mongodb').ObjectID;
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

var addToCollection = function(collection, object, cb){
  var mongoOpts = {
    set: {$set : object},
    upsert: { upsert: true}
  }
  if (object.hasOwnProperty('url')){
    collection.update( {url: object.url}, mongoOpts.set, mongoOpts.upsert)
  }
  cb(object._id);
}



var addBeerToBar = function(collection, id){
    collection.update( {url: object.url}, mongoOpts.set, mongoOpts.upsert)
}

var connectToDb = function(err, beerObject, lastUpdated, cb){
  if (err) {
    console.log('Unable to add to collection');
  }else{
    MongoClient.connect(MongoServer, function(err, db) {
      if(!err) {
        var collection = db.collection('beers');
        addToCollection(collection, beerObject, function(id){
          // Add id to bar collection
          db.collection('bars').update({ name: beerObject.bar },{$push: {'beers': id}});
        });
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

function checkIfBarExists(bar, db, cb){
  console.log('Checking if ' + bar.name + ' exists');
  db.collection('bars').findOne({'bar': bar.bar}, function(err, doc){
    cb(doc);
  });
}


function checkLastUpdated(bar, db, newBar, cb){
  console.log('checkLastUpdated bar: ', JSON.stringify(bar));
  var upToDate;
  db.collection('bars').findOne({'name': bar.name}, function(err, doc){
    console.log('Found doc: ' + JSON.stringify(doc));
    if (doc.lastUpdated < bar.lastUpdated || (newBar)) {
      upToDate = false;
    } else {
      upToDate = true;
    }
    cb(upToDate);
  });
}

function parseDate(date){
  var removedDate  = date.substring(date.indexOf(":") + 1),
  parsedDate = removedDate.substring(0, removedDate.indexOf('|'));
  console.log('Returning parsedDate: ', parsedDate);
  return parsedDate
}

/**
 * Given a bar object containing a url, getBeers returns an
 * array of beer strings.
 */
function getBeers(bar, cb){
  var newBar;
  // console.log('getting beers for bar: ' + bar.name);
  request(bar.url, function (err, res, body) {
    var $             = cheerio.load(body),
    beers             = $(bar.css),
    beersFormatted    = [],
    rawUpdated        = $('.pure-u-1-2 span').text();

    bar.lastUpdated   = parseDate(rawUpdated);
    $(beers).each(function(i, beer) {
      beersFormatted.push($(beer).text().trim());
    });

    // console.log('rawUpdated: ', rawUpdated);
    console.log('bar.lastUpdated: ', bar.lastUpdated);
    var dbBar = {
      name: bar.name,
      lastUpdated: bar.lastUpdated,
      beers: []
    }

    MongoClient.connect(MongoServer, function(err, db) {
      checkIfBarExists(dbBar, db, function(status) {
        // If the bar doesn't exist in the db
        if (status === null){
          console.log(dbBar.name + ' does not exist.'
                                  +'\nAdding ' + JSON.stringify(dbBar) + 'to the db');
          newBar = true;
          var collection = db.collection("bars");
          collection.insert(dbBar);
        }
        db.close();
      });
    });

    MongoClient.connect(MongoServer, function(err, db) {
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
}


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
    connectToDb(null, data, lastUpdated, cb);
  });
}

var processBeers = function(callback){
  async.forEach(bars, function(bar, callback){
    getBeers(bar, function(err, beers, lastUpdated) {
      async.forEach(beers, function(beer, callback){
        console.log('Scraping: ', bar.name);
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