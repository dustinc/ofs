
// globals

var controller = {},
    app,
    db;

// constructor

module.exports = function(_app) {
  app = _app;
  db = app.set('db');
  return controller;
};

// index

controller.index = function(req, res, next) {
  return res.render('user/index',
    {users: db.users.getUsers()}
  );
};

controller.show = function(req, res, next) {
  return res.render('user/show',
    {user: db.users.findOne({_id: req.param('id')}) }
  );
};

// create new user

controller.create = function(req, res, next) {
  
  var User = db.main.model('User'),
      user = new User(req.param('user'));
  
  user.save(function(err) {
    console.log('saving in controller...');
    if(!err) {
      console.log('saved');
    } else {
      console.log(err + ' <- error saving');
    }
  });
  return res.render('user/index', {users: db.users.getUsers()});
};

// load user form

controller.edit = function(req, res, next) {
  var user = db.users.findById(req.param('id'));
  return res.render('user/edit', {user: user})
};

// update user info

controller.update = function(req, res, next) {
  var user = req.body.user;
  
  return db.users.findOne({ _id: user._id}, function(err, _user) {
    if(err) return next(err);

    _user.name.first = user.name.first;
    _user.name.last = user.name.last;
    _user.email = user.email;
    _user.username = user.username;
    _user.password = user.password;

    _user.save(function(err) {
      if(err) return next(err);
    });
    
    return res.redirect('/user/' + user._id);
  });
};

// delete user

controller.delete = function(req, res, next) {
  return db.users.findOne({ _id: req.param('id') }, function(err, _user) {
    if(err) return next(err);
    _user.remove();
    return res.redirect('/user');
  });
};
