var express = require('express');
var router = express.Router();

var bar = require('../scripts/sources.js'),
bars_arr = bar.bars;

// /* GET home page. */
// router.get('/', function (req, res, next) {
//   // res.render('beerlist', { bar: bars });
//   // res.render('bar', { test: "test" });
//   // console.log(bars)
//   var db = req.db;
//   var collection = db.get('beers');
//   collection.find({}, {}, function (error, docs) {
//     res.render('beerlist', {
//       'beerlist': docs
//     })
//   })
// });




/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('main', { title: bars_arr });
});




router.get('/helloworld', function (req, res) {
  res.render('helloworld', { title: 'Hello Baltimore Resident'});
});

router.get('/express', function (req, res) {
  res.render('index', { title: 'Express' });
});


router.get('/main', function (req, res) {
  res.render('main', { title: bars_arr });
  // console.log("req " + req);
  // console.log("res " + res);
});

router.get('/index', function (req, res) {
  var db = req.db;
  var collection = db.get('beers');
  collection.find({}, {}, function (error, docs) {
    res.render('beerlist', {
      'beerlist': docs
    })
  })
});


// Dynamic routes
router.get('/bar/:name', function (req, res) {
  var db = req.db;
  var collection = db.get('beers');
  console.log(req.params.name);
  collection.find({bar:req.params.name}, {}, function (error, docs) {
    res.render('index', {
      'beerlist': docs
    })
  })
});


module.exports = router;


