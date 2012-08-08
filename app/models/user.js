
const Schema = require('mongoose').Schema,
      ObjectId = Schema.ObjectId;


var User = module.exports = new Schema({
  name: {
    first: String,
    last: String
  },
  email: {
    type: String, 
    required: true, 
    index: {unique: true, sparse: true}
  }
});

User.statics.getUsers = function(callback) {
  return this.find().sort('_id','descending').limit(15).find({}, callback);
};

User.pre('save', function(next) {
  console.log('Saving...');
  next();
});

User.pre('remove', function(next) {
  console.log('Removing...');
  next();
});

User.pre('init', function(next) {
  console.log('Initializing...');
  next();
});
