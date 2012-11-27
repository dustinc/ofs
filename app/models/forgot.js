
var Schema = require('mongoose').Schema,
    ObjectId = Schema.ObjectId,
    TimeStamp = require('./timestamp');


var Forgot = module.exports = new Schema({
  user_id: { type: ObjectId, required: true },
  key: { type: String, required: true },
  active: { type: Boolean, default: true, required: true }
});

Forgot.plugin(TimeStamp);

// Virtuals

Forgot.virtual('reset_link').get(function() {
  return '/forgotpassword?ui='+this.user_id+'&k='+this.key;
});

// PRE Hooks

Forgot.pre('save', function(next) {
  next();
});