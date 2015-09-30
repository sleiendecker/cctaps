// Imports
var UntappdClient = require("../node_modules/node-untappd/UntappdClient",false);
var MongoClient = require('mongodb').MongoClient;    
var fs = require('fs');
var util = require('util');
var keys = require("./keys/untappd_keys");
var scrape = require("./scrape");


// scrape.sj imports
var cheerio = require('cheerio'),
request		 	= require('request'),
bar 				= require('./sources.js'),
bars        = bar.bars	 ;

// Set to true if you want to see all sort of nasty output on stdout.
var debug = false;

// Create Client
var untappd = new UntappdClient(debug);
untappd.setClientId(keys.clientId);
untappd.setClientSecret(keys.clientSecret);

// // Get Beer
var add_beer = function(beer){
	untappd.searchBeer(function(err,obj){
		if (debug) console.log(err,obj);
		if (obj && obj.response) {
			var beers = obj.response.beers.items;
			if (typeof beers[0] !== 'undefined' && beers[0]) {
				var first = beers[0].beer;
				// console.log("Adding " + first + " to mongo")
				var db_beer = {
					'name' : first.beer_name,
					'abv' : first.beer_abv + "%",
					'style' : first.beer_style
				}
				var MongoClient = require('mongodb').MongoClient;    
				MongoClient.connect("mongodb://localhost:27017/cctaps", function(err, db) {
		  	if(!err) {
		    	console.log("We are connected");
		    	var collection = db.collection('beers');
		    	console.log("Adding " + db_beer + " to the collection");
		  		collection.insert(db_beer);
		  		}
				});
			}
		}
		else {
			console.log(err,obj);
		}
	},beer);
}

bars.forEach(function (bar) {
  request(bar.url, function (err, res, body) {
    $ = cheerio.load(body);
    beers = $(bar.css);
    console.log('\n\n***' + beers.length + ' beers at ' + bar.name + '***\n');
    $(beers).each(function (i, beer) {
      console.log((i+1) + ". " + $(beer).text());
      add_beer($(beer).text());
    });
  });
});
