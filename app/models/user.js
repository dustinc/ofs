
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
  username: {
    type: String,
    required: true,
    index: {unique: true, sparse: true}
  },
  password: String,
  user_type: {type: String, required: true},
  is_admin: {type: Boolean, required: false, default: 0},
  roles: Array
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

User.virtual('firstname').get(function() {
  return this.name.first;
});

User.virtual('lastname').get(function() {
  return this.name.last;
});

// return all users

User.statics.getUsers = function(callback) {
  return this.find();
};


// pre init

User.pre('init', function(next) {
  next();
});

// pre save

User.pre('save', function(next) {
  next();
});

// pre remove

User.pre('remove', function(next) {
  next();
});
