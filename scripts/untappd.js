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

var get_collection = function(collection_name, data){
		var MongoClient = require('mongodb').MongoClient;
		MongoClient.connect("mongodb://localhost:27017/cctaps", function(err, db) {
			if(!err) {
  	  	console.log("Querying: " + collection_name);
  	  	var collection = db.collection(collection_name);
  	  	
  	  	db.collection.find({name : /Harpoon Octoberfest/});
  			
  			}
		});
	}

// add_to_collection('beers', 'Harpoon Octoberfest');

// Get Beer
var add_beer = function(beer){
	untappd.searchBeer(function(err,obj){
		check_response(obj);
		if (obj && obj.response) {
			
			var beers = obj.response.beers.items;
			if (typeof beers[0] !== 'undefined' && beers[0]) {
				var first = beers[0].beer;
				console.log("\n\nbeer id:" + first.bid);
				// var id = untappd.beerInfo(first.bid)
				

				untappd.beerInfo(function(err,obj){
				if (obj && obj.response) {
					var res = obj.response;
					var beer = res.beer;
					
					var db_beer = {
						'name' : beer.brewery.brewery_name + "\n|\n" + beer.beer_name,
						'abv' : beer.beer_abv + "%",
						'rating': Math.round(beer.rating_score * 20),
						'style' : beer.beer_style
					}

				console.log("db_beer: " + JSON.stringify(db_beer));
				
				add_to_collection('beers', db_beer)
				
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

// bars.forEach(function (bar) {
//   request(bar.url, function (err, res, body) {
//     $ = cheerio.load(body);
//     beers = $(bar.css);
//     console.log('\n\n***' + beers.length + ' beers at ' + bar.name + '***\n');
//     $(beers).each(function (i, beer) {
//       console.log((i+1) + ". " + $(beer).text());
//       add_beer($(beer).text());
//     });
//   });
// });


