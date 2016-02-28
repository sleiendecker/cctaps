'use strict';

// Mongo Imports
var MongoClient = require('mongodb').MongoClient;
var MongoServer = "mongodb://localhost:27017/cctaps";
var ObjectID = require('mongodb').ObjectID;

// Dependencies
var async   = require('async'),
cheerio = require('cheerio'),
request = require('request'),
bars     = require('./sources.js').bars;

var ba  = require('./ba_api.js');


var addToCollection = function(collection, object, cb){
  if (object.rating === '-'){
    console.log('No rating')
  }else{
    console.log('Found rating: ', object.rating);
  }
  console.log('\n\nBeer: ' + object.name + ' --- Rating: ' + object.rating);
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
    // console.log('Unable to add to collection');
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
    console.log('beerInfo', beerInfo);
    beerInfo = JSON.parse(beerInfo);
      cb(null, beerInfo);
  });
}

function getUrl(beerName, cb) {
  ba.beerURL(beerName, function(url) {
    cb(null, url);
  });
}

function formatRating(rating){

  var rating = (rating*20+10);
  console.log('Formating: ', rating);
  var newRating = Math.floor( rating );
  console.log('newRating: ', newRating);
  return newRating;
  // parsedDate = removedDate.substring(0, removedDate.indexOf('|'));

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
    newRating: formatRating((beer.rAvg)),
    style : beer.beer_style,
    url: url
  }
  cb(null, dbBeer)
}

function checkIfBarExists(bar, db, cb){

  console.log('BE FIRST');
  db.collection('bars').findOne({'bar': bar.name}, function(err, doc){
    console.log('checkIfBarExists: ', checkIfBarExists);
    cb(doc);
  });
}


function checkLastUpdated(bar, db, newBar, cb){
  console.log('BE SECOND');
  var upToDate;
  db.collection('bars').findOne({'name': bar.name}, function(err, doc){
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
  return parsedDate
}

/**
 * Given a bar object containing a url, getBeers returns an
 * array of beer strings.
 */
function getBeers(bar, cb){
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

    var dbBar = {
      name: bar.name,
      lastUpdated: bar.lastUpdated,
      beers: []
    }

    MongoClient.connect(MongoServer, function(err, db) {
      checkIfBarExists(dbBar, db, function(status) {
        // If the bar doesn't exist in the db
        if (status === null){
          console.log('bar does not exist!');
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