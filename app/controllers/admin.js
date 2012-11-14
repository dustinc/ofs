
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

controller.index = function(req, res, next) {
  return res.render('admin/index');
};

controller.users = function(req, res, next) {
  var users = db.users.find();
  return res.render('admin/users',
    { users: users }
  );
};

controller.lookups = function(req, res, next) {
  return res.render('admin/lookups',
    { lookups: db.lookups.find() }
  );
};


controller.quick_edit_li = function(req, res, next) {
  return res.render('admin/quick_edit_li', { lookup_value: '' });
};