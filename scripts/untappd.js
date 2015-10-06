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

  			collection.insert(data);
  			}
		});
	}

// var add_beer = function(collection_name, data){
// 		var MongoClient = require('mongodb').MongoClient;
// 		MongoClient.connect("mongodb://localhost:27017/cctaps", function(err, db) {
// 			if(!err) {
//   	  	console.log("Querying: " + collection_name);
//   	  	var collection = db.collection(collection_name);
//   	  	console.log("data: " + data);
//   	  	console.log("DATA: " + JSON.stringify(data));
//   	  	var name = JSON.stringify(data.name)
//   	  	var beer = name.split("|").pop();
//   	  	console.log("NAME: " + JSON.stringify(data.name));
//   	  	// beer = name.substring(name.indexOf("\n|\n") + 1);
//   	  	console.log("BEER: " + beer);
//   	  	// Remove everything before '|' so it's only looking for the beer
//   	  	// beer = name.substring(name.indexOf("|\n") + 1);

//   	  	// Regex search beer in case anything is added to beer name (nitro, firkin, year, etc)
//   	  	collection.find({"name" : new RegExp(beer)}).toArray(function(err, results){
//    				if (results.length > 0){
//    					console.log(beer + " is already in the db."); // output all records
//    				}else{
//    					add_to_collection(collection_name, data)
//    				}


// 				});
// 			}
// 		});
// 	}


// Get Beer
var add_beer = function(beer){
	untappd.searchBeer(function(err,obj){
		check_response(obj);
		if (obj && obj.response) {

			var beers = obj.response.beers.items;
			// Add function to evaluate each beer's data.
			// Return closest match, and ensure they all have a name and abv.
			if (typeof beers[0] !== 'undefined' && beers[0]) {
				var first = beers[0].beer;
				console.log("\n\nbeer id:" + first.bid);
				untappd.beerInfo(function(err,obj){
				if (obj && obj.response) {
					var beer = obj.response.beer;
					var db_beer = {
						'name' : beer.brewery.brewery_name + "|" + beer.beer_name,
            'abv' : Number(beer.beer_abv),
            // Untappd's rating is out of 5.
            // Multiplying by 20 and rounding so rating style is consistent
						'rating': Math.round(beer.rating_score * 20),
						'style' : beer.beer_style,
						// URL for the beer's untappd page
						'slug' : 'http://untappd.com/b/' + beer.beer_slug + "/" + beer.bid,
						'label' : beer.beer_label
					}
				// console.log("db_beer: " + JSON.stringify(db_beer));
				add_to_collection('beers', db_beer)
				}else {console.log(err,obj);
			};
		}, first.bid);
		}
		}
	},
	beer);
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


