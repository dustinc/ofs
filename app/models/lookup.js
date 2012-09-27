
var Schema = require('mongoose').Schema,
    TimeStamp = require('./timestamp');

/*
 * Lookup Schema
 */

var Lookup = module.exports = new Schema({
  name: { type: String, required: true, index: { unique: true } },
  values: []
});

// timestamp plugin

Lookup.plugin(TimeStamp);


// PRE Hooks

Lookup.pre('init', function(next) {
  next();
});

Lookup.pre('save', function(next) {
  next();
});

Lookup.pre('remove', function(next) {
  next();
});


// POST Hooks

Lookup.post('init', function() {
  if(this.values.length) {
    for(var i in this.values) {
      if(typeof this.values[i] == 'object' && this.values[i].hasOwnProperty('name')) {
        this[this.values[i].name.toLowerCase().replace(' ', '_')] = this.values[i];
      }
    }
  }
});