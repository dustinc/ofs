
module.exports = function(app) {

  var main = require('../app/controllers/main')(app),
      admin = require('../app/controllers/admin')(app),
      user = require('../app/controllers/user')(app),
      lookup = require('../app/controllers/lookup')(app),
      article = require('../app/controllers/article')(app),
      db = app.set('db'),

      // middleware
      middleware = require('../lib/middleware')(app),
      isLoggedIn = middleware.isLoggedIn,
      authenticatedAdmin = middleware.authenticatedAdmin,
      authenticatedUser = middleware.authenticatedUser;



  // set local auth var for all pages.
  app.get('/*', isLoggedIn);

  /*
   * Requires Authentication
  */

  // admin
  app.get('/admin', authenticatedAdmin, admin.index);
  app.get('/admin/users?', authenticatedAdmin, user.index);
  app.get('/admin/user/:user_id/delete', authenticatedAdmin, user.delete);
  app.get('/admin/quick_edit_li', authenticatedAdmin, admin.quick_edit_li);// remove this

  // articles
  app.get('/admin/articles', authenticatedAdmin, article.index);
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
  app.get('/user/:user_id/resetpassword', authenticatedUser, user.resetpassword);
  app.post('/user/:user_id/resetpassword', authenticatedUser, user.resetpassword);
  app.post('/user/:user_id/update', authenticatedUser, user.update);

  //user profile
  app.get('/user/:user_id/profile', authenticatedUser, user.profile);
  app.get('/user/:user_id/profile/edit', authenticatedUser, user.profile.edit);
  app.post('/user/:user_id/profile/save', authenticatedUser, user.profile.save);


  /*
   * Viewable By All
  */

  // login
  app.post('/login', main.login);
  app.get('/logout', main.logout);

  // create new user
  app.get('/signup', main.signup);
  app.post('/user/create', user.create);

  app.get('/forgotpassword', main.forgotpassword);
  app.post('/forgotpassword', main.forgotpassword);

  // general
  app.get('/', main.index);
  app.get('/about', main.load.bind(null, 'about'));

  // articles
  app.get('/articles?', article.index);
  app.get('/articles?/show', article.show);
  app.get('/articles?/:article_id', article.show);

  // article pages
  app.get('/forums', function(req, res, next) {next()});
  app.get('/page/:slug', article.page);

  // file
  app.get('/file/:file_id', main.file);

  // searches
  app.get('/search/faculty', main.faculty_search);// add seach middleware to show limited search/results to unauthorized users
  app.get('/search/jobs', main.job_search);// same as adjunct search

  // xhr markdown
  app.get('/markdown', function(req, res, next) {
    var md = require('discount');
    if(!req.xhr) {
      return res.send('not allowed');
    }

    return res.send(md.parse(req.query.markdown));
  });

  // temp
  app.get('/loadfixtures', main.loadfixtures);


  /*
   * End of the trail, catch-all 404
  */

  app.get('/*', function(req, res, next) {
    res.status(404);
    next(new Error('Sorry, the page you are you looking for does not exist.'));
  });

};