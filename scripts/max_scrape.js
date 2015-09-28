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


bars.forEach(function (bar) {
  request(bm.url + bar.url, function (err, res, body) {
    $ = cheerio.load(body);
    console.log('\n\nOn tap at ' + bar.name);
    beers = $(bm.css);
    $(beers).each(function (i, beer) {
      console.log($(beer).text());
    });
  });
});