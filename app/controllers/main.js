
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


controller.index = function(req, res, next) {
  res.render('home', {title: 'My Site Title'});
};

controller.signup = function(req, res, next) {
  var user_types = db.lookups.findOne({name: 'User Types'});
  return res.render('signup', {user_types: user_types});
};

controller.adjunct_search = function(req, res, next) {

  var lookups = db.lookups.findOne({name: 'Teacher Lookups'}),
      query = db.teachers.find().populate('user_id'),
      post = req.param('adjunct');

  if(post) {
    for(var key in post) {
      if(post[key] != '') {
        query.where(key, post[key]);
      }
    }
  }

  return res.render('adjunct_search', {lookups: lookups, search_results: query.exec()});
};

controller.job_search = function(req, res, next) {
  return res.send('job search');
};