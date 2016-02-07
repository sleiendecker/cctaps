// Imports
var UntappdClient = require("../node_modules/node-untappd/UntappdClient",false);
var MongoClient = require('mongodb').MongoClient;
var fs = require('fs');
var util = require('util');
var keys = require("./keys/untappd_keys");
var scrape = require("./scrape");

var ba = require('./ba_api.js');

var cheerio = require('cheerio'),
request		 	= require('request'),
bar 				= require('./sources.js'),
bars        = bar.bars;

// Set to true if you want to see all sort of nasty output on stdout.
var debug = false;

// Create Client
var untappd = new UntappdClient(debug);
untappd.setClientId(keys.clientId);
untappd.setClientSecret(keys.clientSecret);



var addToCollection = function(data){
	var MongoClient = require('mongodb').MongoClient;
	MongoClient.connect("mongodb://localhost:27017/cctaps", function(err, db) {
		if(!err) {
	  	console.log("We are connected");
	  	console.log("Adding " + JSON.stringify(data) + " to the beers collection");
	  	var collection = db.collection("beers");
      console.log('bar name: ' + data.bar);
			collection.insert(data);
      return
			}
	});
}

function getInfo(url, cb){
  ba.beerPage(url, function(beer) {
      cb(beer);
  });
}


function getUrl(beerName, cb) {
  ba.beerURL(beerName, function(url) {
      cb(url);
  });
}

function buildObject(beer, bar, serving, url, cb){
  if (typeof beer[0] !== 'undefined' && beer[0]) {
    var beer = JSON.parse(beer)[0];
    var dbBeer = {
      'bar' : bar,
      'brewery' : beer.brewery_name,
      'name' : beer.beer_name,
      'abv' : beer.beer_abv,
      'rating': beer.ba_score,
      'style' : beer.beer_style,
      'url': url,
      'serving': serving
    }
    console.log("Created " + dbBeer + " object");
    cb(dbBeer)
  }
}

function serving(type){
  if (typeof type === 'undefined'){
    // if serving type isn't specific, assign on_tap
    return 'on_tap';
  }
  return type;
}

function get_beers(bar, cb){
  console.log('getting beers for bar: ' + bar);
  request(bar.url, function (err, res, body) {
    $ = cheerio.load(body);
    beers = $(bar.css);
    console.log('\n\n***' + beers.length + ' beers at ' + bar.name + '***\n');
    $(beers).each(function (i, beer) {
      // This is bm-specific. Add handler for custom css.
      var parent_id = $(beers[i]).closest('ul').attr('id');
      console.log((i+1) + ". " + $(beer).text());
      cb($(beer, bar.name).text(), bar.name, serving(parent_id));
    });
  });
}

bars.forEach(function (bar){
  get_beers(bar, function (beer, bar, serving){
    getUrl(beer, function (url){
      getInfo(url, function (data){
        buildObject(data, bar, serving, url, function(data){
          addToCollection(data);
        })
      })
    })
  })
})

