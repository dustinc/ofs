
var Schema = require('mongoose').Schema,
    ObjectId = Schema.ObjectId,
    TimeStamp = require('./timestamp');


var Institution = module.exports = new Schema({
  name: { type: String },
  description: { type: String }
});

Institution.plugin(TimeStamp);