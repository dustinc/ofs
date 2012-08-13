module.exports = function(app) {
  
  var home = require('../app/controllers/home')(app);
  var user = require('../app/controllers/user')(app);
  var lookup = require('../app/controllers/lookup')(app);
  
  var db = app.set('db');
  
  app.get('/', home.index);

  app.get('/about', home.load.bind(null, 'about'));

  app.get('/user', user.index);
//  app.get('/user/create', user.create);
  app.get('/user/:id', user.show);
  app.get('/user/:id/edit', user.edit);
  app.get('/user/:id/delete', user.delete);
  
  app.post('/user/create', user.create);
  app.post('/user/edit', user.update);

  app.get('/lookup', lookup.index);
  app.get('/lookup/create', lookup.create);
  app.get('/lookup/:name', lookup.show);
  app.get('/lookup/:name/edit', lookup.edit);
  app.get('/lookup/:name/update', lookup.update);
  app.get('/lookup/:name/remove', lookup.delete);

};

