
// Globals

var controller = {},
    app,
    db;

// Constructor

module.exports = function(_app) {
  app = _app;
  db = app.set('db');
  return controller;
};

// Index

controller.index = function(req, res, next) {
  return res.render('user/index',
    {user: db.users.findOne({'_id': req.param('user_id')}) }
  );
};

// create new user

controller.create = function(req, res, next) {

  var User = db.main.model('User'),
      user = new User(req.body.user);

  user.save(function(err) {
    if(err) next(err);
    return res.render('user/' + user._id, {user: user});
  });

};

// load user form

controller.edit = function(req, res, next) {
  var user = db.users.findById(req.param('user_id')),
      Lookup = db.lookups;

  return res.render('user/edit', {user: user, user_types: Lookup.load('User Types')});
};

// update user info

controller.update = function(req, res, next) {
  var user = req.body.user;

  db.users.findOne({ _id: user._id}, function(err, _user) {
    if(err) return next(err);

    _user.name.first = user.name.first;
    _user.name.last = user.name.last;
    _user.email = user.email;
    _user.username = user.username;
    _user.password = user.password;
    _user.user_type = user.user_type;

    _user.save(function(err) {
      if(err) return next(err);
      return res.redirect('/user/' + _user._id);
    });

  });
};

// delete user

controller.delete = function(req, res, next) {
  return db.users.findOne({ _id: req.param('user_id') }, function(err, _user) {
    if(err) return next(err);
    _user.remove();
    return res.redirect('/user');
  });
};
