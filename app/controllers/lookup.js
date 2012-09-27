
// globals

var controller = {},
    app,
    db;

module.exports = function(_app) {
  app = _app;
  db = app.set('db');
  return controller;
};

controller.index = function(req, res, next) {
  var lookups = db.main.model('Lookup').find();
  return res.render('lookup', {lookups: lookups});
};

// Create new

controller.create = function(req, res, next) {

  var Lookup = db.main.model('Lookup'),
      lookup = new Lookup(req.param('lookup'));

  lookup.save(function(err) {
    if(err) return next(err);

    return res.redirect('/lookup/'+lookup.name);
  });
};

// Show single lookup details

controller.show = function(req, res, next) {
  return res.render('lookup/show',
    { lookup: db.lookups.findOne({'name': req.param('name')}) }
  );
};

// Edit page

controller.edit = function(req, res, next) {
  return res.render('lookup/edit',
    { lookup: db.lookups.findOne({'name': req.param('name')}) }
  );
};

// Add to existing lookup doc values array

controller.update = function(req, res, next) {
  var lookup = req.param('lookup');

  return db.main.model('Lookup').findOne({'name': req.param('name')}, function(err, _lookup) {
    if(err) return next(err);

    _lookup.name = lookup.name;
    _lookup.values = lookup.values;

    _lookup.save(function(err) {
      if(err) return next(err);

      if(req.xhr) {
        return res.send('Saved Lookup');
      }

      return res.redirect('/lookup/'+_lookup.name);
    });

  });

};