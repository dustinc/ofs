const mongoose = require('mongoose');

require('express-mongoose');

module.exports = function() {
  mongoose.model('User', require('../app/models/user'));
  mongoose.model('Lookup', require('../app/models/lookup'));
  mongoose.model('Teacher', require('../app/models/teacher'));
  mongoose.model('Article', require('../app/models/article'));
  mongoose.model('Counter', require('../app/models/counter'));
};
