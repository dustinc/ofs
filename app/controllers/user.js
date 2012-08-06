
var controller = {},
    app,
    db;


module.exports = function(_app) {
  app = app;
  //db = app.set('db');
  return controller;
};

controller.index = function(req, res, next) {
  res.send('user index');
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
