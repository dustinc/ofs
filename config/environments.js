module.exports = function(app) {
  
  var port = process.env.PORT || 3000;

  // All Environments
  app.configure(function() {
    app
      .set('version', '0.0.1')
  });

  // Development
  app.configure('development', function() {
    app
      .set('host', 'localhost')
      .set('port', port)
      .set('env', 'development')
  });

  // Production
  app.configure('production', function() {
    app
      .set('host', '')
      .set('port', 80)
      .set('env', 'production')
  });

}
