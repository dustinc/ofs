const mongoose = require('mongoose');

require('express-mongoose');

module.exports = function() {
  mongoose.model('User', require('../app/models/user'));
  mongoose.model('Lookup', require('../app/models/lookup'));
};
