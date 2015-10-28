// Imports
var UntappdClient = require("../node_modules/node-untappd/UntappdClient",false);
var MongoClient = require('mongodb').MongoClient;
var fs = require('fs');
var util = require('util');
var keys = require("./keys/untappd_keys");
var scrape = require("./scrape");

var ba = require('./ba_api.js');

// scrape.sj imports
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


var check_response = function(res){
	if (res.meta.code == 500){ throw res.meta.error_detail }
}

var add_to_collection = function(collection_name, data){
		var MongoClient = require('mongodb').MongoClient;
		MongoClient.connect("mongodb://localhost:27017/cctaps", function(err, db) {
			if(!err) {
  	  	console.log("We are connected");
  	  	console.log("Adding " + JSON.stringify(data) + " to the " + collection_name + " collection");
  	  	var collection = db.collection(collection_name);
        console.log('bar name: ' + data.bar);
  			collection.insert(data);
  			}
		});
	}



// Get Beer
// var add_beer = function(beer, bar){
// 	untappd.searchBeer(function(err,obj){
// 		check_response(obj);
// 		if (obj && obj.response) {

// 			var beers = obj.response.beers.items;
// 			// Add function to evaluate each beer's data.
// 			// Return closest match, and ensure they all have a name and abv.
// 			if (typeof beers[0] !== 'undefined' && beers[0]) {
// 				var first = beers[0].beer;
// 				console.log("\n\nbeer id:" + first.bid);
// 				untappd.beerInfo(function(err,obj){
// 				if (obj && obj.response) {
// 					var beer = obj.response.beer;
//           console.log("\n\nBEER:\n" + beer);
// 					var db_beer = {
//             'bar' : bar,
// 						'brewery' : beer.brewery.brewery_name,
//             'name' : beer.beer_name,
//             'abv' : Number(beer.beer_abv),
//             // Untappd's rating is out of 5.
//             // Multiplying by 20 and rounding so rating format is consistent
// 						'rating': Math.round(beer.rating_score * 20),
// 						'style' : beer.beer_style,
// 						// URL for the beer's untappd page
// 						'slug' : 'http://untappd.com/b/' + beer.beer_slug + "/" + beer.bid,
// 						'label' : beer.beer_label
// 					}
// 				// console.log("db_beer: " + JSON.stringify(db_beer));
// 				add_to_collection('beers', db_beer)
// 				}else {console.log(err,obj);
// 			};
// 		}, first.bid);
// 		}
// 		}
// 	},
// 	beer);
// }






function get_info(url, cb){
  ba.beerPage(url, function(beer) {
      return cb(beer);
  });
}

function get_url(beer_name, cb) {
  console.log("GET_URL BEER 1: " + beer_name);
  ba.beerURL(beer_name, function(url) {
    console.log("GET_URL BEER 2: " + beer_name);
      cb(url);
  });
}

function add_beer(name, bar){
  get_url(name, function (url) {
    console.log("FOUND URL: " + url);
    get_info(url, function (beer) {

      if (typeof beer[0] !== 'undefined' && beer[0]) {
        var beer = JSON.parse(beer)[0];

        // Works
        // console.log("beer: " + JSON.stringify(beer.beer_name));
        // var test = JSON.stringify(beer.beer_name)
        console.log("\n\nPARSED" + JSON.stringify(beer));

        var db_beer = {
          'bar' : bar,
          'brewery' : beer.brewery_name,
          'name' : beer.beer_name,
          'abv' : beer.beer_abv,
          'rating': beer.ba_score,
          'style' : beer.beer_style
        }
        console.log("Adding:" + JSON.stringify(db_beer + " to the db"));
        add_to_collection('beers', db_beer)
      }
    });
  });
}

// add_beer("Anchor Steam", "Wylie Gunters");



bars.forEach(function (bar) {
  request(bar.url, function (err, res, body) {
    $ = cheerio.load(body);
    beers = $(bar.css);
    console.log('\n\n***' + beers.length + ' beers at ' + bar.name + '***\n');
    $(beers).each(function (i, beer) {
      console.log((i+1) + ". " + $(beer).text());
      add_beer($(beer, bar.name).text(), bar.name);
    });
  });
});


