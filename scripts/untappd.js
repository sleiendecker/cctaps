// Imports
var UntappdClient = require("../node_modules/node-untappd/UntappdClient",false);
var MongoClient = require('mongodb').MongoClient;    
var fs = require('fs');
var util = require('util');
var keys = require("./keys/untappd_keys.js");
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

var callback = function(err, obj) {
		if (debug) console.log(err,obj);
		if (obj && obj.response) {
			console.log("obj: " + obj);
			console.log("obj.response: " + obj.response);
			var beers = obj.response.beers.items;
			if (typeof beers[0] !== 'undefined' && beers[0]) {
				var first = beers[0].beer;
				console.log("\n\nbeer id:" + first.bid);
				// var id = untappd.beerInfo(first.bid)
				// console.log(first.bid);
				var db_beer = {
					'name' : first.beer_name,
					'abv' : first.beer_abv + "%",
					'style' : first.beer_style
				}
				

				// var MongoClient = require('mongodb').MongoClient;
				// MongoClient.connect("mongodb://localhost:27017/cctaps", function(err, db) {
		  // 	if(!err) {
		  //   	console.log("We are connected");
		  //   	var collection = db.collection('beers');
		  //   	console.log("Adding " + db_beer + " to the collection");
		  // 		collection.insert(db_beer);
		  // 		}
				// });
			}

		}
		else {
			console.log(err,obj);
		}
		console.log("db_beer: " + db_beer);
		return db_beer
	}

// var test_beer = 'Punkin Ale'

// // // Get Beer
// var add_beer = function(beer){
// 	callback(untappd.searchBeer(err, obj)), beer);
// }



// // // Get Beer
var add_beer = function(beer){
	untappd.searchBeer(function(err,obj){
		if (obj.meta.code == 500){ throw obj.meta.error_detail }
		if (obj && obj.response) {
			
			var beers = obj.response.beers.items;
			if (typeof beers[0] !== 'undefined' && beers[0]) {
				var first = beers[0].beer;
				console.log("\n\nbeer id:" + first.bid);
				// var id = untappd.beerInfo(first.bid)
				

				untappd.beerInfo(function(err,obj){
				if (obj && obj.response) {
					// console.log("obj: " + JSON.stringify(obj));

					var res = obj.response;
					var beer = res.beer;
					var brewery = res.brewery;
					// console.log("BEER INFO OBJ: " + JSON.stringify(obj));
					// console.log("beer: " + JSON.stringify(beer));
					console.log("brewery: " + JSON.stringify(beer.brewery));
					// console.log("brewery: " + JSON.stringify(brewery));

					var db_beer = {
						'name' : beer.brewery.brewery_name + "\n|\n" + beer.beer_name,
						'abv' : beer.beer_abv + "%",
						'rating': Math.round(beer.rating_score * 20),
						'style' : beer.beer_style
					}

				console.log("db_beer: " + JSON.stringify(db_beer));


				var MongoClient = require('mongodb').MongoClient;
				MongoClient.connect("mongodb://localhost:27017/cctaps", function(err, db) {
		  		if(!err) {
		  	  	console.log("We are connected");
		  	  	var collection = db.collection('beers');
		  	  	console.log("Adding " + db_beer + " to the collection");
		  			collection.insert(db_beer);
		  			}
				});
				}else {console.log(err,obj);
			};
		}, first.bid);
		}
		}
	},
	beer);
}

// add_beer('Punkin');

// Get beer info

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
