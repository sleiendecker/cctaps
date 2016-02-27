'use strict';

// Mongo Imports
var MongoClient = require('mongodb').MongoClient;
var MongoServer = "mongodb://localhost:27017/cctaps";

var addToCollection = function(collection, object, cb){
  console.log('\n\nBeer: ' + object.name + ' --- Rating: ' + object.rating);
  var mongoOpts = {
    set: {$set : object},
    upsert: { upsert: true}
  }
  if (object.hasOwnProperty('url')){
    collection.update( {url: object.url}, mongoOpts.set, mongoOpts.upsert)
  }
  cb(object._id);
}


module.exports = {

  addBeerToBar: function(collection, id){
      collection.update( {url: object.url}, mongoOpts.set, mongoOpts.upsert)
  },

  connectToDb: function(err, beerObject, lastUpdated, cb){
    if (err) {
      // console.log('Unable to add to collection');
    }else{
      MongoClient.connect(MongoServer, function(err, db) {
        if(!err) {
          var collection = db.collection('beers');
          addToCollection(collection, beerObject, function(id){
            // Add id to bar collection
            db.collection('bars').update({ name: beerObject.bar },{$push: {'beers': id}});
          });
          db.close();
        }
      });
    }
    cb();
  },

  checkIfBarExists: function(bar, db, cb){
    console.log('SEARCHING FOR ', bar.name)
    db.collection('bars').findOne({'bar': bar.name}, function(err, doc){
      console.log('checkIfBarExists doc: ', doc);
      cb(doc);
    });
  },

  checkLastUpdated: function(bar, db, newBar, cb){
    // console.log('checkLastUpdated bar: ', JSON.stringify(bar));
    var upToDate;
    db.collection('bars').findOne({'name': bar.name}, function(err, doc){
      if(err){
        console.log('ERR: ', err);
      }else{
        console.log('checkLastUpdated doc: ', doc);
        if (doc.lastUpdated < bar.lastUpdated || (newBar)) {
          upToDate = false;
        } else {
          upToDate = true;
        }
        cb(upToDate);
      }
    });
  },

  MongoServer: MongoServer,
  MongoClient: MongoClient

}
