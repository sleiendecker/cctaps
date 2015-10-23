var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
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
