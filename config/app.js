
/**
 * Load dependencies.
 */


const express       = require('express'),
      less          = require('less-middleware'),
      mongoose      = require('mongoose'),
      models        = require('./models'),
      config        = require('./config'),
      routes        = require('./routes'),
      environments  = require('./environments');
//      errors        = require('./errors'),
//      hooks         = require('./hooks');


/**
 * Exports
 */

module.exports = function() {
  
  const app = express.createServer();

  models(app);

  config(app);

  environments(app);

  routes(app);

 // errors(app);

//  hooks(app);

  return app;

};

/*
var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path');

var app = express();

require('./rr')(app, routes);

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(require('less-middleware')({ src: __dirname + '/public' }));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

//app.get('/', routes.index);
//app.get('/dustin', routes.dustin);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
*/
