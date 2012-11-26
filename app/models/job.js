
var Schema = require('mongoose').Schema,
    ObjectId = Schema.ObjectId,
    TimeStamp = require('./timestamp');


var Job = module.exports = new Schema({
  institution: { type: ObjectId, ref: 'Institution', required: true },
  location: { type: String },
  category: { type: String },
  posted: { type: String },
  due_date: { type: Date },
  type: { type: String },
  notes: { type: String },
  description: { type: String },
  file: { type: ObjectId, ref: 'File', required: false }
});

Job.plugin(TimeStamp);