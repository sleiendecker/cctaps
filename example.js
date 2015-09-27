// An example of how to use the UntappdClient.
//
// By Glen R. Goodwin
// twitter: @areinet

// Imports
var UntappdClient = require("./node_modules/node-untappd/UntappdClient",false);

var keys = require("./untappd_keys")
console.log(keys.clientId);

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



