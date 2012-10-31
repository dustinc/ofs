
var middleware = {};

module.exports = function(app) {
  return middleware;
};

middleware.isLoggedIn = function(req, res, next) {
  var s_user = (req.session.user) ? req.session.user : false;
  res.local('s_user', s_user);
  next();
};

middleware.authRequired = function(req, res, next) {
  if(!req.session.user) {
    res.status(403);
    return next(new Error('User Not Authorized'));
  }
  next();
};

middleware.isAdmin = function(req, res, next) {
  if(!req.session.user.is_admin) {
    res.status(403);
    return next(new Error('Must be Admin to Access Page'));
  }
  next();
};

middleware.isThisUser = function(req, res, next) {
  if(req.params.user_id != req.session.user._id && !req.session.user.is_admin) {
    res.status(404);
    return next(new Error('Sorry, the page you are you looking for does not exist.'));
  }
  next();
};

middleware.authenticatedAdmin = [middleware.authRequired, middleware.isAdmin];

middleware.authenticatedUser = [middleware.authRequired, middleware.isThisUser];