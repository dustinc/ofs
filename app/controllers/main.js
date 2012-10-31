
var controller = {},
    app,
    db;


module.exports = function(_app) {
  app = _app;
  db = app.set('db');
  return controller;
};

controller.load = function(template, req, res, next) {
  if(!template) {
    return next(new Erro("missing template"));
  }
  res.render(template);
};

// index

controller.index = function(req, res, next) {
  res.render('home');
};

// login

controller.login = function(req, res, next) {
  var phash = require('password-hash'),
      verr = false;

  db.users.findOne({username: req.body.username}, function(err, _user) {
    if(err) return next(err);

    if(!_user) {
      verr = true;
      req.flash('error', 'User Not Found');
      return res.redirect(req.header('Referrer'));
    }

    if(!phash.verify(req.body.password, _user.password)) {
      verr = true;
      req.flash('error', 'Password Does Not Match');
    }

    if(!verr) {
      // log in user
      req.flash('info', 'Login Successful! Welcome Back, %s', _user.name.first)
      req.session.user = _user;
    }

    return res.redirect(req.header('Referrer'));

  })

};

controller.logout = function(req, res, next) {
  req.session.destroy();
  return res.redirect('/');
};

// signup

controller.signup = function(req, res, next) {
  var user_types = db.lookups.findOne({name: 'User Types'});
  return res.render('signup', {user_types: user_types});
};

// adjunct search

controller.faculty_search = function(req, res, next) {

  var query = db.teachers.find().populate('user_id'),
      post = req.query.faculty || {},
      page = 1,
      limit = 10,
      req_url = req.url.replace(/(&page=\d*|page=\d*&*)/, '').replace(/\?$/, ''),
      page_url = req_url + ((req_url == req.route.path) ? '?' : '&') + 'page=';

  // build query
  if(post) {
    for(var key in post) {
      if(post[key] != '') {
        query.where(key, post[key]);
      }
    }
  }

  // limit
  query.limit(limit);

  // pagination
  if(req.query.page) {
    page = parseInt(req.query.page);
    query.skip((page - 1) * limit);
  }

  return res.render('faculty_search', {
      lookups: db.lookups.findOne({name: 'Teacher Lookups'}),
      search_query: post,
      search_results: query.exec(),
      total_results: db.teachers.find().count(),
      page: page,
      page_url: page_url,
      page_total: (page * limit)
  });

};

// job search

controller.job_search = function(req, res, next) {
  return res.send('job search');
};

// load fixtures - temp controller

controller.loadfixtures = function(req, res, next) {


  var User = db.users,
      Lookup = db.lookups,
      user_fixture = {
        "email" : "tester@testing.com",
        "username" : "tester",
        "is_admin" : true,
        "name" : { "first" : "Test", "last" : "User" },
        "password" : "sha1$6184983d$1$76bca90f2e87e81e797654a853862bb0e67806ad",
        "user_type" : "Administrator"
      },
      lookup_fixtures = [{
        "name" : "Teacher Lookups",
        "values" : [{
          "name" : "Degree Types",
          "values" : [
            "Doctorates",
            "Masters",
            "Bachelors"
      ]},
      {
        "name" : "Service Types",
        "values" : [
          "Dissertation/Thesis",
          "University/College"
        ]
      },
      {
        "name" : "Delivery Modes",
        "values" : [
          "Face to Face",
          "Online",
          "Both"
        ]
      },
      {
        "name" : "Years Teaching",
        "values" : [
          "0",
          "1-3",
          "4-6",
          "7-10",
          "11+"
        ]
      },
      {
        "name" : "Institution Types",
        "values" : [
          "K12 School",
          "Community/Technical College",
          "University/College"
        ]
      },
      {
        "name" : "Course Types",
        "values" : [
          "K12",
          "Undergraduate",
          "Graduate"
        ]
      }
    ] },
    {"name" : "User Types", "values" : [ "Institution", "Teacher", "Administrator" ] }];





  var user = new User(user_fixture);
  user.save(function(err) {
    //if(err) return next(err);

    Lookup.collection.remove(function(err) {
      if(err) return next(err);
      var total = lookup_fixtures.length,
          count = 0;

      lookup_fixtures.forEach(function(fixture) {
        var lookup = new Lookup(fixture);
        lookup.save(function(err) {
          if(err) return next(err);
          count++;
          if(count == total) {
            req.flash('info', 'Fixures Loaded');
            return res.redirect(req.header('Referrer'));
          }
        });
      });

    });

  });


};