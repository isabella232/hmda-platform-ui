#!/usr/bin/env node

var path = require('path');
var express = require('express');
var historyApiFallback = require('express-history-api-fallback');
var apiRouter = require('./routes/api');
var bodyParser = require('body-parser');

var app = express();

//Log paths
app.use(function(req, res, next){
  console.log(req.url);
  next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//serve the app
app.use(express.static('dist'));

//serve the api, routes are nested in various modules
app.use('/api', apiRouter);

//serve the app even when a user refreshes from a client-side route defined by the history api
app.use(historyApiFallback(path.join('dist', 'index.html'), {root: '.'}));

app.listen(3000);