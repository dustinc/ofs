
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
  app.get('/forums', function(req, res, next) {return res.send('forums');});
  app.get('/templates-and-tutorials', function(req, res, next) {return res.send('templates-and-tutorials');});
  app.get('/personalized-help', function(req, res, next) {return res.send('personalized-help');});

  // searches
  app.get('/search/adjunct', main.adjunct_search);
  app.get('/search/jobs', main.job_search);

  // admin
  app.get('/admin', admin.index);
  app.get('(?:\/admin)?/users?', user.index);
  app.get('/admin/quick_edit_li', admin.quick_edit_li);

  // users
  app.get('/user/:user_id', user.show);
  app.get('/user/:user_id/edit', user.edit);
  app.get('/user/:user_id/save', user.save);
  app.get('/user/:user_id/delete', user.delete);
  app.post('/user/create', user.create);
  app.post('/user/:user_id/update', user.update);

  //user profile
  app.get('/user/:user_id/profile', user.profile);
  app.get('/user/:user_id/profile/edit', user.profile.edit);
  app.post('/user/:user_id/profile/save', user.profile.save);

  // lookups
  app.get('(?:\/admin)?/lookups?', lookup.index);
  app.get('(?:\/admin)?/lookups?/create', lookup.create);
  app.get('(?:\/admin)?/lookups?/:name', lookup.show);
  app.get('(?:\/admin)?/lookups?/:name/edit', lookup.edit);
  app.post('(?:\/admin)?/lookups?/:name/update', lookup.update);
  app.get('(?:\/admin)?/lookups?/:name/remove', lookup.delete);

};