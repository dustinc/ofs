const mongoose = require('mongoose');

require('express-mongoose');

module.exports = function() {
  mongoose.model('User', require('../app/models/user'));
  mongoose.model('Lookup', require('../app/models/lookup'));
  mongoose.model('Teacher', require('../app/models/teacher'));
  mongoose.model('Article', require('../app/models/article'));
  mongoose.model('Comment', require('../app/models/comment'));
  mongoose.model('Counter', require('../app/models/counter'));
  mongoose.model('File', require('../app/models/file'));
  mongoose.model('Job', require('../app/models/job'));
  mongoose.model('Institution', require('../app/models/institution'));
  mongoose.model('Forgot', require('../app/models/forgot'));
  mongoose.model('Target', require('../app/models/target'));
};
