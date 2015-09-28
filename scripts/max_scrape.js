var cheerio = require('cheerio'),
request		 	= require('request'),
bar 				= require('./sources.js'),
bm 				  = bar.bm,
bars        = bar.bars;




// // maxs scrape
// request(bar.maxs.url, function(err, resp, body){
//   $ = cheerio.load(body);
//   console.log('\n\nmaxs:')
//   beers = $(bar.maxs.css);
//   $(beers).each(function(i, beer){
//     console.log($(beer).text());
//   });
// });


// var get_tap_list = function(bar){
// 	request(bm.url + bar.url, function(err, resp, body){
// 	  $ = cheerio.load(body);
// 	  console.log('\n\nOn tap at ' + bar.name);
// 	  beers = $(bm.css);
// 	  $(beers).each(function(i, beer){
// 	    console.log($(beer).text());
// 	  });
// 	});
// }

var get_tap_list = function(arr, cb){
  for(i = 0; i < bars.length; i ++){
    cb(bars[i]);
  }
}

get_tap_list(bars, function(bar){
  request(bm.url + bar.url, function(err, resp, body){
    $ = cheerio.load(body);
    console.log('\n\nOn tap at ' + bar.name);
    beers = $(bm.css);
    $(beers).each(function(i, beer){
      console.log($(beer).text());
    });
  });
});


