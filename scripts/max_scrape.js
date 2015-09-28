var cheerio = require('cheerio'),
request		 	= require('request'),
bar 				= require('./sources.js'),
lis 				= bar.bm.css;

bm


// maxs scrape
request(bar.maxs.url, function(err, resp, body){
  $ = cheerio.load(body);
  console.log('\n\nmaxs:')
  beers = $(bar.maxs.css);
  $(beers).each(function(i, beer){
    console.log($(beer).text());
  });
});

// gunt scrape
request(bar.gunts, function(err, resp, body){
  $ = cheerio.load(body);
  beers = $(bar.bm.css);
  console.log('\n\ngunts:')
  $(beers).each(function(i, beer){
    console.log($(beer).text());
  });
});

// // metro scrape
request(bar.metro, function(err, resp, body){
  $ = cheerio.load(body);
  console.log('\n\nmetro:')
  beers = $(bar.bm.css);
  $(beers).each(function(i, beer){
    console.log($(beer).text());
  });
});

// // wife scrape
request(bar.wife	, function(err, resp, body){
  $ = cheerio.load(body);
  console.log('\n\nwife:')
  beers = $(bar.bm.css);
  $(beers).each(function(i, beer){
    console.log($(beer).text());
  });
});


// Wrap up in function
var get_bms = function(bar_name){
	request(bar_name, function(err, resp, body){
	  $ = cheerio.load(body);
	  console.log('On tap at ' + bar_name);
	  beers = $(bar.bm.css);
	  $(beers).each(function(i, beer){
	    console.log($(beer).text());
	  });
	});
}


// var bars = [bar.gunts, bar.metro, bar.liq, bar.wife];
// for(i = 0; i < bars.length; i ++){
// 	get_bms(i);
// }





