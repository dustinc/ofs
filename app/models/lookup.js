
var Schema = require('mongoose').Schema,
    TimeStamp = require('./timestamp');

var Lookup = module.exports = new Schema({
  name: { type: String, required: true, index: { unique: true }},
  values: Array
});

Lookup.plugin(TimeStamp);
