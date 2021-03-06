
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

  var sm = require('sitemap');

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
  app.post('/admin/articles?/:article_id/save', authenticatedAdmin, function(req, res, next) {

    if(req.files.article_file) {

      var fs = require('fs'),
          File = db.files,
          new_file;

      new_file = {
        name: req.files.article_file.name,
        type: req.files.article_file.type,
        size: req.files.article_file.size,
        body: fs.readFileSync(req.files.article_file.path)
      };

      file = new File(new_file);

      file.save(function(err) {
        if(err) return next(err);

        req.body.article.files = [{
          _id: file._id,
          name: file.name
        }];

        return next();
      });

    } else {
      return next();
    }

  }, article.save);
  app.post('/comment', authenticatedUser, article.comment);
  app.get('/comment/delete', authenticatedAdmin, article.comment_delete);


  // lookups
  app.get('/admin/lookups?', authenticatedAdmin, lookup.index);
  app.get('/admin/lookups?/create', authenticatedAdmin, lookup.create);
  app.get('/admin/lookups?/load', authenticatedAdmin, lookup.load);
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
  app.get('/user/:user_id/profile', user.profile);
  app.get('/user/:user_id/profile/edit', authenticatedUser, user.profile.edit);
  app.post('/user/:user_id/profile/img-upload', authenticatedUser, user.profile.img_upload);
  app.post('/user/:user_id/profile/save', authenticatedUser, user.profile.save);


  /*
   * Viewable By All
  */


  // login
  app.get('/login', main.login);
  app.post('/login', main.login);
  app.get('/logout', main.logout);


  // create new user
  app.get('/signup', main.signup);
  app.post('/user/create', user.create);

  // Forgot Password
  app.get('/forgotpassword', main.forgotpassword);
  app.post('/forgotpassword', main.forgotpassword);


  // general
  app.get('/', main.index);


  // articles
  app.get('/articles?', article.index);
  app.get('/articles?/show', article.show);
  app.get('/articles?/:article_id', article.show);

  app.get('/personalized-help', function(req, res, next) {
    req.query.page_title = 'Personalized Help';
    req.query.categories = ['Personalized Help'];
    next();
  }, article.index);

  app.get('/tutorials-and-templates', function(req, res, next) {
    req.query.page_title = 'Tutorials And Templates';
    req.query.categories = ['Tutorials And Templates', 'Tutorial', 'Template'];
    next();
  }, article.index);

  app.get('/discussion-boards', function(req, res, next) {
    req.query.page_title = 'Discussion Boards';
    req.query.categories = ['Discussion Boards', 'Discussion'];
    next();
  }, article.index);

  app.get('/weekly-thoughts', function(req, res, next) {
    req.query.page_title = 'Weekly Thoughts';
    req.query.categories = ['Weekly Thoughts'];
    next()
  }, article.index);

  app.get('/top-articles', article.top_articles);
  app.get('/popular-discussions', article.popular_discussions);


  // file
  app.get('/file/:file_id', main.file);


  // Searches
  // TODO Middleware limiting results to unauthorized/unpaid
  app.get('/faculty/search', main.faculty_search);
  app.get('/jobs?/search', main.job_search);

  // Jobs
  app.get('/jobs?/details', main.job_details);

  sitemap = sm.createSitemap ({
    hostname: 'http://onlinefacultysupport.com',
    cacheTime: 600000,
    urls: [
      { url: '/' },
      { url: '/articles' },
      { url: '/personalized-help' },
      { url: '/tutorials-and-templates' },
      { url: '/discussion-boards' },
      { url: '/top-articles' },
      { url: '/popular-discussions' },
      { url: '/faculty/search' },
      { url: '/jobs/search' },
      { url: '/jobs/details' }
    ]
  });

  app.get('/sitemap.xml', function(req, res) {
    sitemap.toXML( function (xml) {
        res.header('Content-Type', 'application/xml');
        res.send( xml );
    });
  });


  // Newsletter
  app.get('/newsletter/signup', main.newsletter_signup);


  // xhr markdown
  app.get('/markdown', function(req, res, next) {
    var md = require('markdown').markdown;
    if(!req.xhr) {
      return res.send('not allowed');
    }

    return res.send(md.toHTML(req.query.markdown));
  });



  /*
   * End of the trail, catch-all 404.
   * But first attempt article page via slug
  */

  app.get('/:slug', article.page);

  app.get('*', function(req, res, next) {
    res.status(404);
    next(new Error('Sorry, the page you are you looking for does not exist.'));
  });

};
