
var controller = {},
    app,
    db,
    sendgrid,
    _;


module.exports = function(_app) {
  app = _app;
  db = app.set('db');
  sendgrid = app.set('sendgrid');
  _ = app.set('_');
  return controller;
};

controller.load = function(template, req, res, next) {
  if(!template) {
    return next(new Erro("missing template"));
  }
  res.render(template);
};

// index

controller.index = function(req, res, next) {
  res.render('home');
};

// login

controller.login = function(req, res, next) {
  var phash = require('password-hash'),
      verr = false;

  if(req.method == 'POST') {
    db.users.findOne({username: req.body.username}, function(err, _user) {
      if(err) return next(err);

      if(_user == null) {
        verr = true;
        req.flash('error', 'Username and/or Password incorrect');
      }

      if(!verr && !phash.verify(req.body.password, _user.password)) {
        verr = true;
        req.flash('error', 'Username and/or Password incorrect');
      }

      if(!verr) {
        // log in user
        req.flash('info', 'Login Successful! Welcome Back, %s', _user.name.first)
        req.session.user = _user;
      }

      // do not redirect back to /login
      if(req.header('Referrer').match(/login$/) != null) {
        return res.redirect('/');
      }

      return res.redirect(req.header('Referrer'));
    });
  } else {
    return res.render('login');
  }

};

// Logout

controller.logout = function(req, res, next) {
  req.session.destroy();
  return res.redirect('/');
};

// Forgot Password - TODO Refactor

controller.forgotpassword = function(req, res, next) {

  var phash = require('password-hash'),
      email_regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if(req.method == 'POST') {

    if(req.body.user) {

      // Reset Password

      // Load Forgot entry
      db.forgots.findOne({ user_id: req.body.user._id, key: req.body.user.k, active: true }, function(err, _forgot) {

        if(err) {
          // Log error and exit
          console.log(err);
          return next(err);
        }

        if(_forgot == null) {
          console.log('"Forgot" entry not found');
          return next();
        }

        // Check date created

        var now = new Date().getTime();

        // Within 24 hrs of created?
        if((_forgot.created_at.getTime() - now) > (24 * 60 * 60 * 1000)) {
          // Expired
          console.log('Key Expired');
          req.flash('error', 'Password Reset Key Expired');

          // Mark link inactive
          _forgot.active = false;

          _forgot.save(function(err) {
            if(err) {
              console.log(err);
              return next(err);
            }

            // Bail to home page
            return res.redirect('/');
          });

        }

        // Load User
        db.users.findOne({ _id: req.body.user._id }, function(err, _user) {

          if(err) {
            console.log(err);
            return next(err);
          }

          if(_user == null) {
            console.log('User not found');
            return next();
          }

          // Check new password
          if(req.body.user.password != '' && req.body.user.password == req.body.user.confirm_password) {

            // Set new password
            _user.password = req.body.user.password;

            // Save and redirect to login page
            _user.save(function(err) {
              if(err) return next(err);
              req.flash('info', 'Password has been reset. Please login using your new password.');

              // Mark link inactive
              _forgot.active = false;

              _forgot.save(function(err) {
                if(err) {
                  console.log('"Forgot" used but may still be marked active');
                  console.log(err);
                }

                // Password successfully reset
                return res.redirect('/login');
              });


            });

          }

        });

      });

    } else {

      // Save Forgot entry and Build Email w/ Link to reset password

      // Keep flash message consistent for security
      req.flash('info', 'Password reset instructions sent your email address.');

      if(!email_regex.test(req.body.email)) {
        console.log('Email not valid');
        return res.redirect('/');
      }

      db.users.findOne({ email: req.body.email }, function(err, _user) {

        if(_user == null) {
          console.log('User not found');
          return res.redirect('/');
        }

        // Save PRC
        delete this.cp;
        var Forgot = db.forgots,
            forgot = new Forgot({
              user_id: _user._id,
              key: phash.generate(this.user_id+_user.password+Math.random())
            });

        forgot.save(function(err) {
          if(err) {
            console.log(err);
            return res.redirect('/');
          }

          // Build email body
          var reset_link = req.protocol+'://'+req.headers.host+forgot.reset_link,
              email_text = "Click this link to reset your password\r\n"+reset_link;

          // Send email
          sendgrid.send({
            to: _user.email,
            from: 'info@onlinefacultysupport.com',
            subject: 'OnlineFacultySupport.com Password Reset',
            text: email_text
          }, function(success, message) {
            return res.redirect('/');
          });

        });

      });

    }

  } else {


    if(req.query.ui && req.query.k) {

      // Validate Link

      // Load Forgot entry
      db.forgots.findOne({ user_id: req.query.ui, key: req.query.k, active: true }, function(err, _forgot) {

        if(err) {
          // Log error and exit
          console.log(err);
          return next(err);
        }

        if(_forgot == null) {
          console.log('"Forgot" entry not found');
          return next();
        }

        // Check date created

        var now = new Date().getTime();

        // Within 24 hrs of created?
        if((_forgot.created_at.getTime() - now) > (24 * 60 * 60 * 1000)) {
          // Expired
          console.log('Key Expired');
          req.flash('error', 'Password Reset Key Expired');

          // Mark link inactive
          _forgot.active = false;

          _forgot.save(function(err) {
            if(err) {
              console.log(err);
              return next(err);
            }

            // Bail to home page
            return res.redirect('/');
          });

        }

        // Load User
        db.users.findOne({ _id: req.query.ui }, function(err, _user) {

          if(err) {
            // Log error and exit
            console.log(err);
            return next(err);
          }

          if(_user == null) {
            // Log user not found and exit
            console.log('User Not Found');
            return next();
          }


          // Allow user access to reset password page
          return res.render('forgotpassword', { user: _user, k: req.query.k });
        });

      });

    } else {
      // First time accessing the page
      return res.render('forgotpassword');
    }
  }

};

// Signup

controller.signup = function(req, res, next) {
  var user_types = db.lookups.findOne({name: 'User Types'});
  return res.render('signup', {user_types: user_types});
};

// adjunct search

controller.faculty_search = function(req, res, next) {

  var query = db.teachers.find().populate('user_id'),
      post = req.query.faculty || {},
      page = 1,
      limit = 10,
      req_url = req.url.replace(/(&page=\d*|page=\d*&*)/, '').replace(/\?$/, ''),
      page_url = req_url + ((req_url == req.route.path) ? '?' : '&') + 'page=';

  // build query
  if(post) {
    for(var key in post) {
      if(post[key] != '') {
        query.where(key, post[key]);
      }
    }
  }

  // limit
  query.limit(limit);

  // pagination
  if(req.query.page) {
    page = parseInt(req.query.page);
    query.skip((page - 1) * limit);
  }

  return res.render('faculty_search', {
      lookups: db.lookups.findOne({name: 'Teacher Lookups'}),
      search_query: post,
      search_results: query.exec(),
      total_results: db.teachers.find().count(),
      page: page,
      page_url: page_url,
      page_total: (page * limit)
  });

};

// Job Search

controller.job_search = function(req, res, next) {

  var request = require('request');

  // Build request link
  var query_string = req.originalUrl.replace(req.path, '');

  // Search
  if(query_string != '') {

    var request_url = 'http://www.higheredjobs.com/search/advanced_action.cfm'+query_string;

    // Send request
    request(request_url, function(err, response, data) {
      if(!err && response.statusCode == 200) {

        // Pull out job results div
        var job_results = data.match(/<div id="jobResults">[^]*<div class="resultsNav">/gm)[0].replace(/<div class="resultsNav">/g, '');

        // Get all hrefs
        var hrefs = job_results.match(/href=".+?"/g);

        // Clean hrefs
        _.each(hrefs, function(href) {
          var query = href.match(/href="details.cfm(.+?)"/);
          if(query != null)
            job_results = job_results.replace(query[0], 'href="/job/details'+query[1]+'"');
        });

        // Remove imgs
        job_results = job_results.replace(/<img.+?>/gm, '');

        // Render
        return res.render('job_search', { job_results: job_results });

      } else {
        return next(err);
      }
    });

  } else {
    return res.render('job_search', { job_results: '' });
  }

};

// Job Details

controller.job_details = function(req, res, next) {

  var request = require('request');

  // Build Request URL
  var query_string = req.originalUrl.replace(req.path, '');
  var request_url = 'http://www.higheredjobs.com/search/details.cfm'+query_string;

  // 404 if page is accessed without query
  if(query_string == '') {
    return next();
  }

  // Send Request
  request(request_url, function(err, response, data) {
      if(!err && response.statusCode == 200) {

        var job_title = data.match(/<h1>(.+?)<\/h1>/g)[0].replace(/<h1>|<\/h1>/g, '');

        // Pull out job details div
        var job_details = data.match(/<div id="job"[^]*?<br clear="all">/gm)[0]
              .replace(/<br clear="all">/, '')
              .replace('style="padding:0 30px;"', '')
              .replace(/^\s+|\s+$/, '')
              .replace(/<h2>More Information.+?<\/h2>/gm, '')
              .replace(/<div id="instProfile">[^]+?<\/div>/gm, '')
              .slice(0, -6);

        // Get all imgs
        var imgs = job_details.match(/<img src=".+?".+?>/g);

        // Fix img src
        _.each(imgs, function(img) {
          var src = img.match(/src="(.+?)"/);
          if(src != null) {
            job_details = job_details.replace(src[1], 'http://www.higheredjobs.com'+src[1]);
          }
        });

        // Render
        return res.render('job_details', { job_title: job_title, job_details: job_details });

      } else {
        return next(err);
      }
  });

};

// File

controller.file = function(req, res, next) {
  db.files.findOne({ '_id': req.params.file_id }, function(err, _file) {
    if(err) return next(err);
    res.contentType(_file.type);
    console.log(_file.body);
    return res.end(_file.body.buffer);
  });
};

// load fixtures - temp controller

controller.loadfixtures = function(req, res, next) {


  var User = db.users,
      Lookup = db.lookups,
      user_fixture = {
        "email" : "tester@testing.com",
        "username" : "tester",
        "is_admin" : true,
        "name" : { "first" : "Test", "last" : "User" },
        "password" : "sha1$6184983d$1$76bca90f2e87e81e797654a853862bb0e67806ad",
        "user_type" : "Administrator"
      },
      lookup_fixtures = [{
        "name" : "Teacher Lookups",
        "values" : [{
          "name" : "Degree Types",
          "values" : [
            "Doctorates",
            "Masters",
            "Bachelors"
      ]},
      {
        "name" : "Service Types",
        "values" : [
          "Dissertation/Thesis",
          "University/College"
        ]
      },
      {
        "name" : "Delivery Modes",
        "values" : [
          "Face to Face",
          "Online",
          "Both"
        ]
      },
      {
        "name" : "Years Teaching",
        "values" : [
          "0",
          "1-3",
          "4-6",
          "7-10",
          "11+"
        ]
      },
      {
        "name" : "Institution Types",
        "values" : [
          "K12 School",
          "Community/Technical College",
          "University/College"
        ]
      },
      {
        "name" : "Course Types",
        "values" : [
          "K12",
          "Undergraduate",
          "Graduate"
        ]
      }
    ] },
    {"name" : "User Types", "values" : [ "Institution", "Teacher", "Administrator" ] }];





  var user = new User(user_fixture);
  user.save(function(err) {
    //if(err) return next(err);

    Lookup.collection.remove(function(err) {
      if(err) return next(err);
      var total = lookup_fixtures.length,
          count = 0;

      lookup_fixtures.forEach(function(fixture) {
        var lookup = new Lookup(fixture);
        lookup.save(function(err) {
          if(err) return next(err);
          count++;
          if(count == total) {
            req.flash('info', 'Fixures Loaded');
            return res.redirect(req.header('Referrer'));
          }
        });
      });

    });

  });


};