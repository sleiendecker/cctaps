// An example of how to use the UntappdClient.
//
// By Glen R. Goodwin
// twitter: @areinet

// Imports
var UntappdClient = require("./node_modules/node-untappd/UntappdClient",false);

var keys = require("./untappd_keys");

// Mongo
// Retrieve
var MongoClient = require('mongodb').MongoClient;

// Connect to the db
MongoClient.connect("mongodb://localhost:27017/cctaps", function(err, db) {
  if(!err) {
    console.log("We are connected");
    var collection = db.collection('beers');
  	var beer1 = {
    "name" : "Allgash Whitest",
    "abv" : 4.9000000000000004,
    "styles" : [ 
        "belgian", 
        "white", 
        "wheat", 
        "witbier"
    ],
    "ratings" : {
        "brosRating" : 88.0000000000000000,
        "baRating" : 82.0000000000000000,
        "untappedRating" : 80.0000000000000000,
        "rateBeerRating" : 55.0000000000000000
    }
}
  	// var doc2 = {'hello':'doc2'};
  	// var lotsOfDocs = [{'hello':'doc3'}, {'hello':'doc4'}];

  	collection.insert(beer1);

  	// collection.insert(doc2, {w:1}, function(err, result) {});

  // collection.insert(lotsOfDocs, {w:1}, function(err, result) {});
  }
});



var insert_beer = function(err, db)


// Definitions

// Replace this with your CLIENT ID
// var clientId = "314AF19444DC464B7A8B0BFFD3B1DD7929C857EC";

// Replace this with your CLIENT SECRET
// var clientSecret = "23F691640CE05F7FFD51DD719CFC4E45A3918763";

// Set to true if you want to see all sort of nasty output on stdout.
var debug = false;

//The user we want to lookup for this example.
// var lookupuser = "stl05";

//The beer we want to lookup for this example.
var lookupbeer = "Punkin";

// Create Client
var untappd = new UntappdClient(debug);
untappd.setClientId(keys.clientId);
untappd.setClientSecret(keys.clientSecret);



// EXAMPLE - List last 25 recent checkins of the given user
// untappd.userFeed(function(err,obj){
// 	if (debug) console.log(err,obj);
// 	if (obj && obj.response && obj.response.checkins && obj.response.checkins.items) {
// 		var beers = obj.response.checkins.items.forEach(function(checkin){
// 			//console.log(checkin);
// 			console.log("\n"+checkin.user.user_name,"drank",checkin.beer.beer_name);
// 			console.log("by",checkin.brewery.brewery_name);
// 			if (checkin.venue.venue_name) console.log("at",checkin.venue.venue_name);
// 			console.log("on",checkin.created_at);
// 		});
// 	}
// 	else {
// 		console.log(err,obj);
// 	}
// },lookupuser);




// Get Beer
untappd.searchBeer(function(err,obj){
	if (debug) console.log(err,obj);
	if (obj && obj.response) {
		var res = obj.response;
		var beers = res.beers.items;

		// var beers = res.beers;
		
		
		console.log("Found " + beers.length + " beers.")
		// console.log(beers);
		var first = beers[0].beer
		var first_id = first.id
		console.log(first);
		
		// var beers = obj.response.checkins.items.forEach(function(checkin){
		// 	//console.log(checkin);
		// 	console.log("\n"+checkin.user.user_name,"drank",checkin.beer.beer_name);
		// 	console.log("by",checkin.brewery.brewery_name);
		// 	if (checkin.venue.venue_name) console.log("at",checkin.venue.venue_name);
		// 	console.log("on",checkin.created_at);
		// });

	}
	else {
		console.log(err,obj);
	}
},lookupbeer);



