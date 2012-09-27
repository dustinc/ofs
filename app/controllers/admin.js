
// Globals

var controller = {},
    app,
    db,
    scripts = [];

// Constructor

module.exports = function(_app) {
  app = _app;
  db = app.set('db');
  scripts.push('/scripts/admin.js');
  controller.scripts = scripts;
  return controller;
};

controller.index = function(req, res, next) {
  return res.render('admin/index', {scripts: scripts});
};

controller.users = function(req, res, next) {
  var users = db.users.find();
  return res.render('admin/users',
    {users: users, scripts: scripts}
  );
};

controller.lookups = function(req, res, next) {
  return res.render('admin/lookups',
    {lookups: db.lookups.find(), scripts: scripts}
  );
};


controller.quick_edit_li = function(req, res, next) {
  return res.render('admin/quick_edit_li', {lookup_value: ''});
};