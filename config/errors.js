module.exports = function(app) {

  app.error(function(err, req, res) {
    var error_header = {
      403: 'Forbidden Page',
      404: 'Page Not Found',
      500: 'Server Error'
    }

    err.status = res.statusCode;
    err.header = error_header[err.status];
    res.render('error', {error: err});
  });

  return app;

}
