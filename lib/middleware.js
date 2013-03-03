
var middleware = {};

module.exports = function(app) {
  return middleware;
};

middleware.isLoggedIn = function(req, res, next) {
  var s_user = (req.user) ? req.user : false;
  //console.log(req.user);
//   var s_user = req.user = { email: 'coffey.dustin@gmail.com',
//   username: 'dustinc',
//   confirm_password: 'none',
//   _id: '5072f1545cb68f3619000008',
//   password: 'sha1$6184983d$1$76bca90f2e87e81e797654a853862bb0e67806ad',
//   user_type: 'Teacher',
//   modified_at: '2012-10-31T16:14:49.617Z',
//   created_at: '2012-10-08T15:25:43.207Z',
//   roles: [],
//   is_admin: true,
//   name: { first: 'Dustin', last: 'Coffey' } };
  
  
  
  res.local('s_user', s_user);
  next();
};

middleware.authRequired = function(req, res, next) {
  if(!req.user) {
    res.status(403);
    return next(new Error('User Not Authorized'));
  }
  next();
};

middleware.isAdmin = function(req, res, next) {
  if(!req.user.is_admin) {
    res.status(403);
    return next(new Error('Must be Admin to Access Page'));
  }
  next();
};

middleware.isThisUser = function(req, res, next) {
  if(req.params.user_id != req.user._id && !req.user.is_admin) {
    res.status(404);
    return next(new Error('Sorry, the page you are you looking for does not exist.'));
  }
  next();
};

middleware.authenticatedAdmin = [middleware.authRequired, middleware.isAdmin];

middleware.authenticatedUser = [middleware.authRequired, middleware.isThisUser];