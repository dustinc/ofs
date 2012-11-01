
var Schema = require('mongoose').Schema,
    ObjectId = Schema.ObjectId,
    TimeStamp = require('./timestamp');


var File = module.exports = new Schema({
  name: String,
  type: String,
  size: String,
  body: {}
});

File.plugin(TimeStamp);