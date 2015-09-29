var cheerio = require('cheerio'),
request		 	= require('request'),
bar 				= require('./sources.js'),
bars        = bar.bars;

bars.forEach(function (bar) {
  request(bar.url, function (err, res, body) {
    $ = cheerio.load(body);
    console.log('\n\n***On tap at ' + bar.name + '***\n');
    $.load(bar.css);
    beers = $(bar.css);
    console.log(beers.length);
    $(beers).each(function (i, beer) {
      console.log($(beer).text());
    });
  });
});


 function foobar(el) { setTimeout(function() { foobar_cont(el); }, 5000); }