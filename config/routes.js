module.exports = function(app) {
  
  var home = require('../app/controllers/home_controller')(app);
  
  var db = app.set('db');
  
  app.get('/', home.index);

  app.get('/about', home.load.bind(null, 'about'));
};

