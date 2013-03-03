
// Globals

var controller = {},
    app,
    db,
    _;

// Constructor

module.exports = function(_app) {
  app = _app;
  db = app.set('db');
  _ = app.set('_');
  return controller;
};

// Index

controller.index = function(req, res, next) {
  return res.render('user/index', { users: db.users.find() } );
};

// Show

controller.show = function(req, res, next) {
  return res.render('user/show',
    {user: db.users.findOne({'_id': req.param('user_id')}), scripts: ['/scripts/profile.js'] }
  );
};

// Create

controller.create = function(req, res, next) {

  var User = db.main.model('User'),
      user = req.body.user,
      verr = false;
console.log(user);
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
    _user.display_name = user.display_name;
    _user.is_admin = user.is_admin;

    _user.user_type = user.user_type;

    _user.save(function(err) {
      if(err) {
        req.flash('error', 'There was an error updating your info');
        return next(err);
      }
      req.flash('info', 'Your info was updated');
      return res.redirect('/user/' + _user._id);
    });

  });
};

// Password Reset

controller.resetpassword = function(req, res, next) {
  var user,
      verr = false,
      phash = require('password-hash');

  if(req.method == 'POST') {
    user = req.body.user;

    if(user.current_password != '') {

      // load user
      db.users.findOne({ _id: user._id}, function(err, _user) {
        if(err) return next(err);

        // verify current password
        if(phash.verify(user.current_password, _user.password)) {

          // new password confirm
          if(user.password == user.confirm_password) {

            // set new password
            _user.password = user.password;

          } else {
            verr = true;
            req.flash('error', 'Password confirmation does not match');
          }

        }

      });

    } else {
      verr = true;
      req.flash('error', 'Please enter current password');
    }

    // do not save if there are validation errors
    if(verr) {
      return res.redirect(req.header('Referrer'));
    }

    _user.save(function(err) {
      if(err) {
        req.flash('error', 'There was a problem updating your password');
      }
      req.flash('info', 'Your password was updated');
      return res.redirect('/user/' + _user._id);
    });

  } else {
    // GET
    user = db.users.findOne({ _id: req.param('user_id')});
  }

  return res.render('user/resetpassword', { user: user });

};

// Delete

controller.delete = function(req, res, next) {
  db.users.findOne({ _id: req.param('user_id') }, function(err, _user) {
    if(err) return next(err);
    if(_user == null) return next();
    db.teachers.findOne({ user_id: _user._id }, function(err, _teacher) {
      _user.remove();
      if(err) return next(err);
      if(_teacher == null) return next();
      _teacher.remove();
    });
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

// Profile Img Upload
controller.profile.img_upload = function(req, res, next) {
  var convert = require('netpbm').convert;

  db.users.findOne({ _id: req.params.user_id }, function(err, _user) {
    if(err) return next(err);
    if(_user == null) return next(new Error('Invalid User Id'));

    var profile_img_name = '/images/profile/' + _user._id + '-thumb.png';

    // Convert img to png of said size
    convert(req.files.profile_image.path,
      __dirname + '/../../public' + profile_img_name,
      { width: 160, height: 160 },
      function(err) {
        if(err) {
          req.flash('error', 'Error uploading profile image');
          return next(new Error('Error uploading profile image'));
        }
        _user.img_path = profile_img_name;
        _user.markModified('img_path');
        _user.save(function(err) {
          if(err) {
            req.flash('error', 'Error saving profile image');
            return next(err);
          }
          req.flash('info', 'Profile image uploaded');
          return res.redirect('/user/'+_user._id);
        });
      }
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

    return res.render('profile/edit', {user: user, profile: _profile, lookups: lookups, scripts: ['/scripts/profile.js']});

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
      _profile.education.degrees                = (_.isArray(p.education.degrees)) ? p.education.degrees: [];
      _profile.education.certificates           = (_.isArray(p.education.certificates)) ? p.education.certificates: [];
      _profile.education.licenses               = (_.isArray(p.education.licenses)) ? p.education.licenses: [];
      _profile.education.other                  = p.education.other;

      // Experience
      _profile.experience.years_teaching        = p.experience.years_teaching;
      _profile.experience.delivery_mode         = p.experience.delivery_mode;
      _profile.experience.years_teaching_online = p.experience.years_teaching_online;
      _profile.experience.courses_taught        = (_.isArray(p.experience.courses_taught)) ? p.experience.courses_taught: [];
      _profile.experience.eligible_areas        = (_.isArray(p.experience.eligible_areas)) ? p.experience.eligible_areas: [];

      // Publication
      _profile.publication.total                = p.publication.total;
      _profile.publication.past_three_years     = p.publication.past_three_years;
      _profile.publication.reviewer             = (p.publication.reviewer) ? p.publication.reviewer : false;
      _profile.publication.reviewer_total       = p.publication.reviewer_total;

      // Presentation
      _profile.presentation.total               = p.presentation.total;
      _profile.presentation.past_three_years    = p.presentation.past_three_years;
      _profile.presentation.reviewer            = (p.presentation.reviewer) ? p.presentation.reviewer : false;
      _profile.presentation.reviewer_total      = p.presentation.reviewer_total;

      // The Rest
      _profile.research_type                    = p.research_type;
      _profile.services                         = (_.isArray(p.services)) ? p.services: [];
      _profile.positions_desired                = (_.isArray(p.positions_desired)) ? p.positions_desired: [];
      _profile.institutions                     = (_.isArray(p.institutions)) ? p.institutions : [];
      _profile.courses                          = (_.isArray(p.courses)) ? p.courses : [];

      // Save
      _profile.save(function(err) {
        if(err) {console.log(err); return next(err);}
        return res.redirect('/user/'+_profile.user_id+'/profile/');
      });

    }// end else

  });

};