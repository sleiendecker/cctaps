'use strict';

import express from 'express';
import logger from 'morgan';
import http from 'http';
import path from 'path';
import favicon from 'serve-favicon';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

const databaseURL = 'mongodb://localhost:27017/cctaps';

const app = express();
const server = http.Server(app);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// server setup
// app.use(express.static(path.join(__dirname, 'app')));
app.use(favicon(path.join(__dirname, '/', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


app.use((req, res, next) => {
  // req.db = db;
  next();
});

// Connect to the db

// app.use(express.static(__dirname + './../../app/'));

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.get('/', (req, res, next) => {
  req.res('views/index.ejs');
});

server.listen(3000);

module.exports = app;