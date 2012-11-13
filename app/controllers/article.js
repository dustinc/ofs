
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

// Index

controller.index = function(req, res, next) {
  var articles = db.articles.find(),
      article_id = req.params.article_id || false,
      categories = req.query.categories || [],
      n = false;

  if(!article_id) {

    // load pages
    if(req.query.is_page) {
      articles.where('is_page', true);
      n = 'new_page';
    }

    // by categories
    if(categories.length > 0) {
      categories = _.isArray(categories) ? categories : [categories];
      categories = _.map(categories, function(category) {
        return category.replace(/\w\S*/g, function(txt) {
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        })
      });

      if(_.indexOf(categories, 'Tutorials And Templates') != -1) {
        n = 'new_tat';
      }
      articles.in('categories', categories);
    }


  } else {
    articles.where('_id', article_id);
  }

  articles.desc('sequence');

  if(req.session.user && req.session.user.is_admin) {
    // extends admin page
    return res.render('article/admin', { articles: articles, n: n });
  }

  return res.render('article', { articles: articles });
};

// Show Single

controller.show = function(req, res, next) {
  var article_id = req.params.article_id || false,
      article = db.articles.findOne(),
      create_new_link;

  if(!article_id) {

    // sequence
    if(req.query.sequence) {
      if(req.query.getnext) {
        article.gt('sequence', req.query.sequence);
      } else if(req.query.getprev) {
        article.lt('sequence', req.query.sequence);
      }
    }

    // has categories
    if(req.query.categories) {
      article.in('categories', req.query.categories);
    }

    // marked as a page
    if(req.query.is_page) {
      article.where('is_page', true);
    }

  } else {
    article.where('_id', article_id);
  }

  article.desc('sequence').exec(function(err, _article) {
    if(_article == null) return next();
    return res.render('article/show',
      { article: _article, create_new_link: create_new_link }
    );
  });

};

// Load Page

controller.page = function(req, res, next) {
  db.main.model('Article').findOne({ 'slug': req.params.slug, 'is_page': true }, function(err, _article) {
    if(_article == null) return next();
    return res.render('article/show', { article: _article });
  });
};

// Load Form

controller.form = function(req, res, next) {
  var article_id = req.params.article_id || false,
      Article = db.articles,
      a = false;

  if(article_id) {
    article = Article.findOne({ '_id': article_id });
  } else {

    if(req.query.new_page) {
      a = { is_page: true };
    } else if(req.query.new_tat) {
      a = { categories: ['Tutorials And Templates'] };
    }

    if(!a) {
      article = new Article();
    } else {
      article = new Article(a);
    }
  }

  return res.render('article/edit', { article: article, scripts: ['/scripts/md-editor.js'] });
};

// Delete

controller.delete = function(req, res, next) {
  var article = db.articles.findOne({ '_id': req.params.article_id }) || false;

  if(article) {
    article.remove();
    req.flash('info', 'Article Deleted');
  }

  return res.redirect('/admin/articles');
};

// Save

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

      _article.title      = a.title;
      _article.body       = a.body;
      _article.is_page    = a.is_page;
      _article.is_active  = a.is_active;

      if(a.categories) {
        _article.categories = a.categories;
      } else {
        _article.categories = [];
      }

      if(_.isArray(a.files) && a.files.length > 0) {
        _.each(a.files, function(file) {
          _article.files.push(file);
        });

      }

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

controller.comment = function(req, res, next) {
  var Comment = db.main.model('Comment'),
      comment = new Comment(req.body.comment);

  if(req.body.in_reply_to) {

    // Reply to comment
    db.articles.findOne({ _id: req.body.article_id }, function(err, _article) {
      if(err) return next(err);

      var reply = function(comments) {

        var replied = false;

        _.each(comments, function(c) {

          if(c._id == req.body.in_reply_to) {
            c.comments.push(comment);
            replied = true;
          } else if(!replied && _.isArray(c.comments) && c.comments.length > 0) {
            replied = reply(c.comments);
          }

        });

        return replied;
      };

      if(reply(_article.comments)) {
        _article.markModified('comments');
      }

      _article.save(function(err) {
        if(err) next(err);
        return res.redirect(req.header('Referrer'));
      });

    });

  } else {

    // Push new comment
    db.articles.update({ '_id': req.body.article_id }, { $push: { 'comments': comment }}, function(err) {
      if(err) return next(err);
      return res.redirect(req.header('Referrer'));
    });

  }

};