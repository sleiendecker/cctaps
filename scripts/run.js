'use strict';

// Dependencies
var async         = require('async'),
bars          = require('./sources.js').bars,
scrape        = require('./scrape'),
beerWaterfall = scrape.beerWaterfall,
getBeers      = scrape.getBeers;


var processBeers = function(callback){
  async.forEach(bars, function(bar, callback){
    getBeers(bar, function(err, beers, lastUpdated) {
      async.forEach(beers, function(beer, callback){
        console.log('Scraping: ', bar.name);
        beerWaterfall(bar, beer, lastUpdated, function(err, res){
          callback();
        })
      }, function(err){
        callback();
      });
    });
  }, function(err){
    if (err){
      console.log('err: ' + err);
    }
  });
}

processBeers(function(err, beers){
  console.log('Beers ', beers);
})