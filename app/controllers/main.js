
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
  var phash = require('password-hash');

  db.users.findOne({username: req.body.username}, function(err, _user) {
    if(err) return next(err);
    
    if(!phash.verify(req.body.password, _user.password)) {
      return res.send('password does not match');
    } else {
      req.session.user = _user;
      return res.redirect(req.header('Referrer'));
    }
    
  })

};

controller.logout = function(req, res, next) {
  //delete req.session.user;
  req.session.destroy();
  return res.redirect('/');
};

// signup

controller.signup = function(req, res, next) {
  var user_types = db.lookups.findOne({name: 'User Types'});
  return res.render('signup', {user_types: user_types});
};

// adjunct search

controller.adjunct_search = function(req, res, next) {

  var query = db.teachers.find().populate('user_id'),
      post = req.query.adjunct,
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

  return res.render('adjunct_search', {
      lookups: db.lookups.findOne({name: 'Teacher Lookups'}),
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