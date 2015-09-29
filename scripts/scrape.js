var cheerio = require('cheerio'),
request		 	= require('request'),
bar 				= require('./sources.js'),
bars        = bar.bars;


var get_list = function(){
	bars.forEach(function (bar) {
	  request(bar.url, function (err, res, body) {
	    $ = cheerio.load(body);
	    beers = $(bar.css);
	    console.log('\n\n***' + beers.length + ' beers at ' + bar.name + '***\n');
	    $(beers).each(function (i, beer) {
	      console.log((i+1) + ". " + $(beer).text());
	    });
	  });
	});
}

// module.exports = get_list;