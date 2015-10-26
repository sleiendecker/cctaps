var rb = require('ratebeer-api');


rb.beerSearch("Anchor Steam", function(beers) {
    console.log(beers);
});