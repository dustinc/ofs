
var Schema = require('mongoose').Schema;

var Counter = module.exports = new Schema({
  _id: String,
  c: { type: Number, default: 0 }
});