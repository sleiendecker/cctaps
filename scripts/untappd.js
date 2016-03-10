'use strict';

// Mongo Imports
var MongoClient = require('mongodb').MongoClient;
var MongoServer = "mongodb://localhost:27017/cctaps";
var ObjectID = require('mongodb').ObjectID;

// Dependencies
var async = require('async'),
cheerio   = require('cheerio'),
request   = require('request'),
sources   = require('./sources.js'),
bars      = sources.bars,
ratingUrl = sources.ratingUrl;

var ba  = require('./ba_api.js');


var addToCollection = function(collection, object, cb){
  if (object.rating === '-'){
    console.log('No rating')
  }
  // console.log('\n\nBar: ' + object.bar +
  //             '\nBeer: ' + object.name +' (' + object.rating + ')');
  var mongoOpts = {
    set: {$set : object},
    upsert: { upsert: true}
  }
  // Update if the query returns an object with a url property (a beer)
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
        // Add beerObject to db
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

function getUrl(beerName, cb) {
  // pass in beer's name to get url
  ba.beerURL(beerName, function(url, err) {
    cb(null, url);
  });
}

function getInfo(url, cb){
  ba.beerPage(url, function(beerInfo) {
    // pass in beer's url to get info
    beerInfo = JSON.parse(beerInfo);
    cb(null, beerInfo);
  });
}

function formatRating(rating){
  if (rating === null){
    return null
  } else {
    return Math.floor( rating * 20 + 10 )
  }
}

function formatAbv(abv){
  if (abv === null){
    return null
  } else {
    return parseFloat(abv.replace('| ','')) + '%'
  }
}

function buildObject(beer, bar, url, cb){
  var beer = beer[0];
  var dbBeer = {
    // Create ObjectID to be added to its bar
    _id: new ObjectID,
    bar : bar,
    brewery : beer.brewery_name,
    name : beer.beer_name,
    abv : formatAbv(beer.beer_abv),
    rating: formatRating(beer.rAvg),
    style : beer.beer_style,
    url: ratingUrl + url
  }
  cb(null, dbBeer)
}

function checkIfBarExists(bar, cb){
  MongoClient.connect(MongoServer, function(err, db) {
    var collection = db.collection("bars");
    collection.findOne({'name': bar.name}, function(err, dbBar){
      if(dbBar === null){
        bar = {name: bar.name, url: bar.url, lastUpdated: null, beers: []};
        console.log('Couldn\'t find ', bar.name, '\nAdding to db');
        collection.insert(bar);
      }else{
        collection.update({name: bar.name }, {$set: {beers: []}})
      }
      bar.beers = [];
      db.close();
      cb(bar);
    });

  });
}

var updateBarLastUpdated = function(bar, lastUpdated, cb){
  MongoClient.connect(MongoServer, function(err, db) {
    var collection = db.collection('bars');
    collection.findOne({'name': bar.name}, function(err, dbBar){
      if (dbBar.lastUpdated === null){
        collection.update({name: bar.name }, {$set: {lastUpdated: lastUpdated}})
      }
      db.close();
      cb(bar);
    });
  });
}

function parseDate(date){
  var removedDate  = date.substring(date.indexOf(":") + 1);
  return removedDate.substring(0, removedDate.indexOf('|'));
}

/**
 * Given a bar object containing a url, getBeers returns an
 * array of beer strings.
 */
function getBeers(bar, cb){
  console.log('getting beers for bar: ' + bar.name);
  request(bar.url, function (err, res, body) {
    var $             = cheerio.load(body),
    beers             = $(bar.css),
    rawUpdated        = $('.pure-u-1-2 span').text();

    bar.lastUpdated   = parseDate(rawUpdated);
    $(beers).each(function(i, beer) {
      bar.beers.push($(beer).text().trim());
    });
      cb(null, bar.beers, bar.lastUpdated);

    });

  };

function buildMissingBeerObject(beer){
  console.log('Building object for : ', beer);
  var obj = [{
      // Create ObjectID to be added to its bar
      brewery_name : null,
      beer_name : beer,
      beer_abv : null,
      rAvg: null,
      beer_style : null
    }]
  console.log('returning object: ', obj);
  console.log('\n\nreturning brewery_name: ', obj.brewery_name);
  return obj;
}

function beerWaterfall(bar, beer, lastUpdated, cb){
  async.waterfall([
    function(callback){
      getUrl(beer, function(err, url){
        callback(err, url);
      });
    },
    function(url, callback){
      if (url === beer){
        callback(null, buildMissingBeerObject(url), null);
      } else{
        getInfo(url, function(err, beerInfo){
          callback(err, beerInfo, url);
        });
      }

    },
    function(beerInfo, url, callback){
      buildObject(beerInfo, bar.name, url, function (err, dbBeer) {
        callback(err, dbBeer);
      });
    }
  ],
  function(err, data){
    connectToDb(null, data, lastUpdated, cb);
  });
}

var processBeers = function(callback){
  async.forEach(bars, function(bar, callback){
    checkIfBarExists(bar, function(bar){
      getBeers(bar, function(err, beers, lastUpdated) {
        updateBarLastUpdated(bar, lastUpdated, function(bar){
          async.forEach(beers, function(beer, callback){
            beerWaterfall(bar, beer, lastUpdated, function(err, res){
              callback();
            });
          }, function(err){
            callback();
          });
        });
      });
    })


  }, function(err){
    if (err){
      console.log('err: ' + err);
    }
  });
}

processBeers(function(err, beers){
  console.log('Beers ', beers);
});