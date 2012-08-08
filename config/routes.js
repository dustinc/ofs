module.exports = function(app) {
  
  var home = require('../app/controllers/home')(app);
  var user = require('../app/controllers/user')(app);
  
  var db = app.set('db');
  
  app.get('/', home.index);

  app.get('/about', home.load.bind(null, 'about'));

  app.get('/user', user.index);
  app.get('/user/create', user.create);
  app.get('/user/:id', user.show);
  app.get('/user/:id/edit', user.edit);
  app.get('/user/:id/delete', user.delete);
  
  app.post('/user/edit', user.update);

};

