
var Schema = require('mongoose').Schema,
      ObjectId = Schema.ObjectId,
      TimeStamp = require('./timestamp');


/*
 * User Schema
 */

var User = module.exports = new Schema({
  name: {
    first: String,
    last: String
  },
  email: {
    type: String, 
    required: true, 
    index: {unique: true, sparse: true}
  },
  password: String
});

// timestamp plugin

User.plugin(TimeStamp);


/*
 * Virtuals, Methods, Statics
 */

// return full name

User.virtual('name.full').get(function() {
  return this.name.first + ' ' + this.name.last;
});

// return all users

User.statics.getUsers = function(callback) {
  return this.find().sort('name.first','ascending');
};


// pre init

User.pre('init', function(next) {
  console.log('Initializing...');
  next();
});

// pre save

User.pre('save', function(next) {
  console.log('Saving...');
  next();
});

// pre remove

User.pre('remove', function(next) {
  console.log('Removing...');
  next();
});
