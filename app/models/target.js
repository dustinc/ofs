
var Schema = require('mongoose').Schema,
    TimeStamp = require('./timestamp');

var Target = module.exports = new Schema({
  email: String
});

Target.plugin(TimeStamp);