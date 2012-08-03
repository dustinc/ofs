module.exports = function(app) {
  
  var port = process.env.PORT || 3000;

  app.configure('local', function() {
    this
      .set('version', '0.0.1')
      .set('host', 'localhost')
      .set('port', port)
      .set('env', 'local')
  });

}
