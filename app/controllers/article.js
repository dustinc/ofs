
var controller = {},
    app,
    db,
    _;


module.exports = function(_app) {
  app = _app;
  db = app.set('db');
  _ = app.set('_');
  return controller;
};

// index

controller.index = function(req, res, next) {
  var articles = db.articles.find(),
      article_id = req.params.article_id || false,
      categories = req.query.categories || [];

  categories = _.isArray(categories) ? categories : [categories];

  if(article_id) {
    articles.where('_id', article_id);
  } else if(0 < categories.length) {
    articles.in('categories', categories);
  }

  articles.desc('sequence');

  if(req.session.user && req.session.user.is_admin) {
    return res.render('article/admin', { articles: articles });
  }
  return res.render('article', { articles: articles });
};

// show single

controller.show = function(req, res, next) {
  var article_id = req.params.article_id;

  db.articles
    .findOne()
    .where('_id', article_id)
    .desc('created_at')
    .exec(function(err, _article) {
      return res.render('article/show', { article: _article });
    });
};

// load page

controller.page = function(req, res, next) {
  var page = req.path.replace(/^\//, '').replace('-', ' ').replace(/\w\S*/, function(m) {return m.charAt(0).toUpperCase();});

  db.main.model('Article').where('categories').in(page).limit(1).exec(function(err, _article) {
      if(_article != null) {
        return res.render('article/show', { article: _article });
      }
      next();
    });

};

// edit

controller.form = function(req, res, next) {
  var article_id = req.params.article_id || false,
      Article = db.articles;

  if(article_id) {
    article = Article.findOne({ '_id': article_id });
  } else {
    article = new Article();
  }

  return res.render('article/edit', { article: article, scripts: ['/scripts/md-editor.js'] });
};

// delete

controller.delete = function(req, res, next) {
  var article = db.articles.findOne({ '_id': req.params.article_id }) || false;

  if(article) {
    article.remove();
    req.flash('info', 'Article Deleted');
  }

  return res.redirect('/admin/articles');
};

// save

controller.save = function(req, res, next) {
  var Article = db.main.model('Article'),
      a = req.body.article;

  Article.findOne({ '_id': req.params.article_id }, function(err, _article) {

    if(null == _article) {

      // create

      db.counters.update({ _id: 'blogSequence' }, { $inc: { c: 1 } }, { upsert: true }, function() {
        db.counters.findOne({ _id: 'blogSequence' }, function(err, _counter) {
          a.sequence = _counter.c;
          _article = new Article(a);
          _article.save(function(err) {
            if(err) {
              req.flash('error', 'Error Saving Aritcle');
              return next(err);
            }
            req.flash('info', 'Article Created');
            return res.redirect('/article/'+_article._id);
          });
        });
      });

    } else {

      // update

      _article.title = req.body.article.title;
      _article.body = req.body.article.body;
      _article.is_active = req.body.article.is_active;

      _article.save(function(err) {
        if(err) {
          req.flash('error', 'Error Saving Aritcle');
          return next(err);
        }
        req.flash('info', 'Article Updated');
        return res.redirect('/article/'+_article._id);
      });
    }

  });

};