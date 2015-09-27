var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/helloworld', function (req, res) {
  res.render('helloworld', { title: 'Hello Baltimore Resident'});
});

router.get('/beerlist', function (req, res) {
  var db = req.db;
  var collection = db.get('beers');
  collection.find({}, {}, function (error, docs) {
    res.render('beerlist', {
      'beerlist': docs
    })
  })
});

module.exports = router;
