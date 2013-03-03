
// dependencies

const express   = require('express'),
      passport  = require('passport'),
      LStrat    = require('passport-local').Strategy,
      FStrat    = require('passport-facebook').Strategy,
      stylus    = require('stylus'),
      mongoose  = require('mongoose'),
      SendGrid  = require('sendgrid').SendGrid,
      sendgrid  = new SendGrid('ericmjameson', 'vfr45$%TGB');
      _         = require('underscore');

// exports

module.exports = function(app) {

  // connect db

  var dblink = process.env.MONGOHQ_URL || 'mongodb://localhost/main';

  const db = mongoose.createConnection(dblink);

  // configure

  app.configure(function() {
    app
      .use(express.logger('dev'))
      .use(express.cookieParser())
      .use(express.session({ secret: 'secret' }))
      .use(express.bodyParser())
      .use(passport.initialize())
      .use(passport.session())
      .use(express.errorHandler({dumpException: true, showStack: true}));
  });

  // template engine

  app.configure(function() {
    app
      .set('_', _)
      .set('views', __dirname + '/../app/views')
      .set('view engine', 'jade')
      .set('view options', {layout:false})
      .use(stylus.middleware({src: __dirname + '/../public'}))
      .use(express.static(__dirname + '/../public'))
      .set('sendgrid', sendgrid);
  });

  app.set('title', 'OFS');

  // extended _

  _.mixin({

    oCompact: function(obj) {

      if(_.isArray(obj)) {
        // is array
        var results = [];
      } else if(_.isObject(obj)) {
        var results = {};
      }

    }

  });

  // db reference

  app.configure(function() {
    app
      .set('db',
        {
          'main': db,
          'users': db.model('User'),
          'lookups': db.model('Lookup'),
          'teachers': db.model('Teacher'),
          'articles': db.model('Article'),
          'comments': db.model('Comment'),
          'counters': db.model('Counter'),
          'files': db.model('File'),
          'jobs': db.model('Job'),
          'institutions': db.model('Institution'),
          'forgots': db.model('Forgot'),
          'targets': db.model('Target')
        }
      )
  });

  app.use(function(req, res, next) {
    res.local('messages');
    next();
  });
  app.dynamicHelpers({ messages: require('express-messages') });




  passport.use(new LStrat(
    function(username, password, done) {
      var db = app.set('db'),
          phash = require('password-hash');
      db.users.findOne({ username: username }, function(err, _user) {
        if(err) return done(err);
        if(!_user) return done(null, false, { message: 'Unknown user ' + username });
        if(!phash.verify(password, _user.password)) { return done(null, false, { message: 'Invalid password' }); }
        return done(null, _user);
      });
    }
  ));
  
//   passport.use(new FStrat({},
//     function(accessToken, refreshToken, profile, done) {
//       // To keep the example simple, the user's Facebook profile is returned to
//       // represent the logged-in user.  In a typical application, you would want
//       // to associate the Facebook account with a user record in your database,
//       // and return that user instead.
//       return done(null, profile);
//     }
//   ));

  passport.serializeUser(function(user, done) {
    console.log(user, 'serializeUser');
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    console.log(id, 'deserializeUser');
    var db = app.set('db');
    db.users.findOne({ _id: id }, function(err, _user) {
      return done(err, _user);
    });
  });


  return app;

};
