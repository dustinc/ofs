module.exports = function(app) {
  
  var port = process.env.PORT || 3000;

  // All Environments
  app.configure(function() {
    this
      .set('version', '0.0.1')
  });

  // Development
  app.configure('development', function() {
    this
      .set('host', 'localhost')
      .set('port', port)
      .set('env', 'development')
  });

  // Production
  app.configure('production', function() {
    this
      .set('host', '')
      .set('port', port)
      .set('env', 'production')
  });

}
