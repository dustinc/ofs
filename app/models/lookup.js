
var Schema = require('mongoose').Schema,
    TimeStamp = require('./timestamp');

var Lookup = module.exports = new Schema({
  name: { type: String, required: true, index: { unique: true }},
  values: Array
});

Lookup.statics.loadTeacherLookups = function(callback) {
  this.where('name').in(['Degrees', 'Service Types']).exec(function(err, lookups) {
    return lookups;
  });
};

Lookup.statics.load = function(name, callback) {
  return this.findOne({'name': name}).select('name', 'values');
};

Lookup.statics.loadProfileLookups = function(profile_type, callback) {
  var l_list = [];

  switch(profile_type) {
    case 'Teacher':
      l_list = ['Degrees', 'Service Types'];
      break;
    case 'Institution':
      l_list = [];
      break;
  }

  this.find({'name': {$in: l_list}}, function(err, _lookups) {
    var teacher_lookups = {};

    if(err) return next(err);

    _lookups.forEach(function(lookup) {
      teacher_lookups[lookup.name.toLowerCase().replace(' ', '_')] = lookup;
    });

    callback(err, teacher_lookups);
  });

};

Lookup.plugin(TimeStamp);

Lookup.pre('init', function(next) {
  next();
});

Lookup.pre('save', function(next) {
  next();
});

Lookup.pre('remove', function(next) {
  next();
});