/**
  * Main application file
  */

 'use strict';

 process.env.NODE_ENV = process.env.NODE_ENV || 'development';

 var http = require('http');
 var express = require('express');
 var mongoose = require('mongoose');
 var config = require('./config/environment');

 mongoose.connect(config.mongo.uri, config.mongo.options);
 mongoose.connection.on('error', function(err) {
   console.error('MongoDB connection error: '  err);
   process.exit(-1);
 });

 var app = express();
 var server = http.createServer(app);
 require('./config/express')(app);
 require('./routes')(app);

 server.listen(config.port, config.ip, function() {
   console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
 });

 exports = module.exports = app;
