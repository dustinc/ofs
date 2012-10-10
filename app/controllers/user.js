
// Globals

var controller = {},
    app,
    db;

// Constructor

module.exports = function(_app) {
  app = _app;
  db = app.set('db');
  return controller;
};

// Index

controller.index = function(req, res, next) {
  return res.render('user/index', { users: db.users.find(), scripts: ['/scripts/admin.js'] } );
};

// Show

controller.show = function(req, res, next) {
  return res.render('user/show',
    {user: db.users.findOne({'_id': req.param('user_id')}) }
  );
};

// Create

controller.create = function(req, res, next) {

  var User = db.main.model('User'),
      user = req.body.user,
      verr = false;

  if(user.email == '') {
    verr = true;
    req.flash('error', 'Email Required');
  }

  if(user.username == '') {
    verr = true;
    req.flash('error', 'Username Required');
  }

  if(user.password == '' || user.password != user.confirm_password) {
    verr = true;
    req.flash('error', 'Password Required');
  }

  if(verr) {
    return res.redirect('/signup');
  }

  delete user.confirm_password;

  new_user = new User(user);

  new_user.save(function(err) {
    if(err) return next(err);
    req.session.user = new_user;
    req.flash('info', '');
    return res.redirect('/user/' + new_user._id);
  });

};

// Edit

controller.edit = function(req, res, next) {
  var user = db.users.findById(req.param('user_id')),
      user_types = db.lookups.find('User Types');

  return res.render('user/edit', {user: user, user_types: user_types});
};

// Update

controller.update = function(req, res, next) {
  var user = req.body.user,
      phash = require('password-hash');


  db.users.findOne({ _id: user._id}, function(err, _user) {
    if(err) return next(err);

    _user.name.first = user.name.first;
    _user.name.last = user.name.last;
    _user.email = user.email;
    _user.username = user.username;

    // set new password
    if(phash.verify(user.current_password, _user.password) && user.password == user.confirm_password) {
      _user.password = user.password;
    }

    _user.user_type = user.user_type;

    _user.save(function(err) {
      if(err) return next(err);
      return res.redirect('/user/' + _user._id);
    });

  });
};

// Delete

controller.delete = function(req, res, next) {
  return db.users.findOne({ _id: req.param('user_id') }, function(err, _user) {
    if(err) return next(err);
    _user.remove();
    return res.redirect('/admin/users');
  });
};


/*
 * User Profile
 */

// Index
controller.profile = function(req, res, next) {
  var user = db.users.findOne({'_id': req.param('user_id')}),
      Profile = db.teachers,
      lookups = db.lookups.findOne({name: 'Teacher Lookups'});

  // get profile
  Profile.findOne({'user_id': req.param('user_id')}, function(err, _profile) {
    if(err) return next(err);

    if(null == _profile) {
      _profile = new Profile();
    }
    return res.render('profile',
      {user: user, profile: _profile, lookups: lookups}
    );

  });

};

// Edit
controller.profile.edit = function(req, res, next) {
  var user = db.users.findOne({'_id': req.param('user_id')}),
      Profile = db.teachers,
      lookups = db.lookups.findOne({name: 'Teacher Lookups'});

  Profile.findOne({'user_id': req.param('user_id')}, function(err, _profile) {
    if(err) return next(err);

    if(null == _profile) {
      _profile = new Profile();
    }

    return res.render('profile/edit', {user: user, profile: _profile, lookups: lookups});

  });
};

// Save
controller.profile.save = function(req, res, next) {
  var Profile = db.main.model('Teacher'),
      p = req.body.profile;

  db.main.model('Teacher').findOne({'_id': p._id}, function(err, _profile) {
    if(err) return next(err);

    if(null == _profile) {
      // Save New

      _profile = new Profile(p);

      _profile.save(function(err) {
        if(err) return next(err);

        return res.redirect('/user/' + _profile.user_id + '/profile/');
      });

    } else {
      // Update Existing

      // Education
      _profile.education.degrees                = p.education.degrees;
      _profile.education.certificates           = p.education.certificates;
      _profile.education.licenses               = p.education.licenses;
      _profile.education.other                  = p.education.other;

      // Experience
      _profile.experience.years_teaching        = p.experience.years_teaching;
      _profile.experience.delivery_mode         = p.experience.delivery_mode;
      _profile.experience.years_teaching_online = p.experience.years_teaching_online;
      _profile.experience.courses_taught        = p.experience.courses_taught;
      _profile.experience.eligible_areas        = p.experience.eligible_areas;

      // Publication
      _profile.publication.publication_type     = p.publication.publication_type;
      _profile.publication.total                = p.publication.total;
      _profile.publication.past_three_years     = p.publication.past_three_years;
      _profile.publication.reviewer             = p.publication.reviewer;
      _profile.publication.reviewer_total       = p.publication.reviewer_total;

      // Presentation
      _profile.presentation.total               = p.presentation.total;
      _profile.presentation.past_three_years    = p.presentation.past_three_years;
      _profile.presentation.reviewer            = p.presentation.reviewer;
      _profile.presentation.reviewer_total      = p.presentation.reviewer_total;

      // The Rest
      _profile.services                         = p.services;
      _profile.positions_desired                = p.positions_desired;
      _profile.institution                      = p.institution;
      _profile.course                           = p.course;

      // Save
      _profile.save(function(err) {
        if(err) return next(err);
        return res.redirect('/user/'+_profile.user_id+'/profile/');
      });

    }// end else

  });

};