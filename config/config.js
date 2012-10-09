
// dependencies

const express   = require('express'),
      stylus    = require('stylus');
      mongoose  = require('mongoose'),
      _         = require('underscore');

// exports

module.exports = function(app) {
  
  // connect db

  var dblink = process.env.MONGOHQ_URL || 'mongodb://localhost/db';

  const db = mongoose.createConnection(dblink);

  // configure

  app.configure(function() {
    app
      .use(express.logger('dev'))
      .use(express.cookieParser())
      .use(express.session({ secret: 'secret' }))
      .use(express.bodyParser())
      .use(express.errorHandler({dumpException: true, showStack: true}));
  });
  
  // template engine

  app.configure(function() {
    app
      .set('views', __dirname + '/../app/views')
      .set('view engine', 'jade')
      .set('view options', {layout:false})
      .use(stylus.middleware({src: __dirname + '/../public'}))
      .use(express.static(__dirname + '/../public'));
  });

  app.set('title', 'OFS');
  
  // db reference

  app.configure(function() {
    app
      .set('db',
        {
          'main': db,
          'users': db.model('User'),
          'lookups': db.model('Lookup'),
          'teachers': db.model('Teacher')
        }
      )
  });

  return app;

};
