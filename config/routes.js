
module.exports = function(app) {

  var main = require('../app/controllers/main')(app),
      admin = require('../app/controllers/admin')(app),
      user = require('../app/controllers/user')(app),
      lookup = require('../app/controllers/lookup')(app),
      article = require('../app/controllers/article')(app),
      db = app.set('db'),

      isLoggedIn = function(req, res, next) {
        var s_user = (req.session.user) ? req.session.user : false;
        res.local('s_user', s_user);
        next();
      },

      authRequired = function(req, res, next) {
        if(!req.session.user) {
          res.status(403);
          return next(new Error('User Not Authorized'));
        }
        next();
      },

      isAdmin = function(req, res, next) {
        if(!req.session.user.is_admin) {
          res.status(403);
          return next(new Error('Must be Admin to Access Page'));
        }
        next();
      },

      isThisUser = function(req, res, next) {
        if(req.params.user_id != req.session.user._id && !req.session.user.is_admin) {
          res.status(404);
          return next(new Error('Sorry, the page you are you looking for does not exist.'));
        }
        next();
      },

      authenticatedAdmin = [authRequired, isAdmin],

      authenticatedUser = [authRequired, isThisUser];





  /*
   * Viewable By All
  */


  // set local auth var for all pages.
  app.get('/*', isLoggedIn);

  // login
  app.post('/login', main.login);
  app.get('/logout', main.logout);

  // general
  app.get('/', main.index);
  app.get('/about', main.load.bind(null, 'about'));
  app.get('/forums', function(req, res, next) {return res.send('forums');});
  app.get('/articles', article.index);
  app.get('/articles?/:article_id', article.show);
  app.get('/personalized-help', function(req, res, next) {return res.send('personalized-help');});

  // searches
  app.get('/search/adjunct', main.adjunct_search);// add seach middleware to show limited search/results to unauthorized users
  app.get('/search/jobs', main.job_search);// same as adjunct search

  // create new user
  app.get('/signup', main.signup);
  app.post('/user/create', user.create);

  app.get('/loadfixtures', main.loadfixtures);

  /*
   * Requires Authentication
  */


  // admin
  app.get('/admin', authenticatedAdmin, admin.index);
  app.get('/admin/users?', authenticatedAdmin, user.index);
  app.get('/admin/user/:user_id/delete', authenticatedAdmin, user.delete);
  app.get('/admin/quick_edit_li', authenticatedAdmin, admin.quick_edit_li);// remove this

  // articles
  app.get('(/admin)?/articles?', article.index);
  app.get('/articles?/:article_id', article.show);
  app.get('/admin/articles?', article.index);
  app.get('/admin/articles?/new', authenticatedAdmin, article.form);
  app.get('/admin/articles?/:article_id/edit', authenticatedAdmin, article.form);
  app.get('/admin/articles?/:article_id/delete', authenticatedAdmin, article.delete);
  app.post('/admin/articles?/:article_id/save', authenticatedAdmin, article.save);


  // lookups
  app.get('/admin/lookups?', authenticatedAdmin, lookup.index);
  app.get('/admin/lookups?/create', authenticatedAdmin, lookup.create);
  app.get('/admin/lookups?/:name', authenticatedAdmin, lookup.show);
  app.get('/admin/lookups?/:name/edit', authenticatedAdmin, lookup.edit);
  app.post('/admin/lookups?/:name/update', authenticatedAdmin, lookup.update);
  app.get('/admin/lookups?/:name/remove', authenticatedAdmin, lookup.delete);

  // users
  app.get('/user/:user_id', authenticatedUser, user.show);
  app.get('/user/:user_id/edit', authenticatedUser, user.edit);
  app.get('/user/:user_id/save', authenticatedUser, user.save);
  app.post('/user/:user_id/update', authenticatedUser, user.update);

  //user profile
  app.get('/user/:user_id/profile', authenticatedUser, user.profile);
  app.get('/user/:user_id/profile/edit', authenticatedUser, user.profile.edit);
  app.post('/user/:user_id/profile/save', authenticatedUser, user.profile.save);


  /*
   * End of the trail, catch-all 404
  */

  app.get('/*', function(req, res, next) {
    res.status(404);
    next(new Error('Sorry, the page you are you looking for does not exist.'));
  });

};