
var Schema = require('mongoose').Schema,
    TimeStamp = require('./timestamp'),
    _ = require('underscore');

/*
 * Lookup Schema
 */

var Lookup = module.exports = new Schema({
  name: { type: String, required: true, index: { unique: true } },
  values: []
});

// timestamp plugin

Lookup.plugin(TimeStamp);


// Statics

Lookup.statics.pushToLookup = function(values, name) {

  this.model('Lookup').findOne({ name: name }, function(err, _lookup) {

    var modified = false;

    // Check each value
    _.each(values, function(value) {

      // Only push new values
      if(_.indexOf(_lookup.values, value) == -1) {
        _lookup.values.push(value);
        modified = true;
      }

    });

    // Save only if values were modified
    if(modified) {
      _lookup.markModified('values');
      _lookup.save(function(err) {
        return (!err);
      });
    }

  });

};

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
        this[this.values[i].name.toLowerCase().replace(/^\s+|\s+$/, '').replace(/\s+/g, '_')] = this.values[i];
      }
    }
  }
});