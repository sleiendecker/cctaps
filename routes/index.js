var express = require('express');
var router = express.Router();

var bar = require('../scripts/sources'),
bars = bar.bars;

/* GET home page. */
router.get('/', function (req, res, next) {
  // res.render('beerlist', { bar: bars });
  // res.render('bar', { test: "test" });
  // res.render("./../views/index.ejs")
  // console.log(bars)
  var db = req.db;
  var collection = db.get('beers');
  collection.find({}, {}, function (error, docs) {
    res.render('beerlist', {
      'beerlist': docs
    })
  })
});

router.get('/helloworld', function (req, res) {
  res.render('helloworld', { title: 'Hello Baltimore Resident'});
});

router.get('/express', function (req, res) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
