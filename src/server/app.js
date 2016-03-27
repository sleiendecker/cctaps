'use strict';

import express        from 'express';
import logger         from 'morgan';
import http           from 'http';
import path           from 'path';
import mongodb        from 'mongodb';
import favicon        from 'serve-favicon';
import cookieParser   from 'cookie-parser';
import bodyParser     from 'body-parser';

// db, app, and server setup
const databaseURL = 'mongodb://localhost:27017/cctaps';
const MongoClient = mongodb.MongoClient;
const app = express();
const server = http.Server(app);
const ObjectID = mongodb.ObjectID;

// view engine setup
app.set('view engine', 'ejs');

// path setup
app.use(express.static(path.join(__dirname, '../../app')));
app.set('views', path.join(__dirname));
app.use(favicon(path.join(__dirname, '/', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

MongoClient.connect(databaseURL, (err, db) => {
  if (err) {
    console.log(err);
    console.log('ERROR: unable to connect to cctaps db');
    return;
  }

  console.log('Loaded the database');

  // default route
  app.get('/', (req, res) => {
    const barsCursor = db.collection('bars').find({});

    barsCursor.toArray((err, records) => {
      if (err) {
        console.log('ERR: ', err);
        process.exit(1);
      }

      const beersCursor = db.collection('beers').find({});

      beersCursor.toArray((err2, records2) => {
        res.render('views/index.ejs', {
          bars: records
        });
      });

    });
  });

  app.get('/api/:barName', (req, res) => {
    const cursor = db.collection('bars').find({name: decodeURIComponent(req.params.barName)});
    let beerIDs = [];

    // getting bar
    cursor.toArray((err, barRecords) => {
      if (err) {
        console.log('ERR: ', err);
        process.exit(1);
      }

      // transforming bars' beers into mongo IDs
      for (let i = 0; i < barRecords[0].beers.length; i++) {
        beerIDs.push(ObjectID(barRecords[0].beers[i]));
      }

      // send beers from specified bar to client
      const cursor2 = db.collection('beers').find({_id: {$in: beerIDs}});
      cursor2.toArray((err, records) => {
        res.send({ beers: records, bar: barRecords[0].name });
      });
    });
  });

  // error handling
  app.use((req, res) => {

    // browser request
    if (req.accepts('html')) {
      res.render('views/404.ejs');
      return;
    }

    // json request
    if (req.accepts('json')) {
      res.send({ error: 'Not found' });
      return;
    }

  });
});

server.listen(3000);

module.exports = app;