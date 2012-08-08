
var controller = {},
    app,
    db;


module.exports = function(_app) {
  app = _app;
  db = app.set('db');
  return controller;
};

controller.index = function(req, res, next) {
  res.render('user/index',
    {users: db.users.getUsers()}
  );
};

controller.create = function(req, res, next) {
  res.send('user create');
};

controller.edit = function(req, res, next) {
  res.send('user edit');
};

controller.delete = function(req, res, next) {
  res.send('user delete');
};
