
module.exports = function(app) {

  var main = require('../app/controllers/main')(app),
      admin = require('../app/controllers/admin')(app),
      user = require('../app/controllers/user')(app),
      lookup = require('../app/controllers/lookup')(app),
      db = app.set('db');

  // general
  app.get('/', main.index);
  app.get('/about', main.load.bind(null, 'about'));
  app.get('/signup', main.signup);



  // admin
  app.get('/admin', admin.index);
  app.get('/admin/users', admin.users);
  app.get('/admin/lookups', admin.lookups);
  app.get('/admin/quick_edit_li', admin.quick_edit_li);

  // users

  app.get('/user/:user_id', user.index);
  app.get('/user/:id/edit', user.edit);
  app.get('/user/:user_id/save', user.save);
  app.get('/user/:user_id/delete', user.delete);
  app.post('/user/create', user.create);
  app.post('/user/:user_id/update', user.update);

  //user profile
  app.get('/user/:user_id/profile', user.profile);
  app.get('/user/:user_id/profile/edit', user.profile.edit);
  app.post('/user/:user_id/profile/save', user.profile.save);

  // lookups
  app.get('/lookup', lookup.index);
  app.get('/lookup/create', lookup.create);
  app.get('/lookup/:name', lookup.show);
  app.get('/lookup/:name/edit', lookup.edit);
  app.post('/lookup/:name/update', lookup.update);
  app.get('/lookup/:name/remove', lookup.delete);

};