

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

controller.test = function(req, res, next) {
  res.send('test');
};
