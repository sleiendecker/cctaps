var cheerio = require('cheerio'),
request		 	= require('request'),
bar 				= require('./sources.js'),
bars        = bar.bars;

bars.forEach(function (bar) {
  request(bar.url, function (err, res, body) {
    setTimeout(function(){
      $ = cheerio.load(body);
      console.log(body);
      console.log('\n\n***On tap at ' + bar.name + '***\n');
      beers = $('.beerfinder-just-tapped hide-during-load');
      console.log('beers', beers)
      $(beers).each(function (i, beer) {
        console.log($(beer).text());
      });
    }, 30000);
  });
});