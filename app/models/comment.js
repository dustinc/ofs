var Schema = require('mongoose').Schema,
    ObjectId = Schema.ObjectId;


var Comment = new Schema();

Comment.add({
  person: String,
  comment: String,
  created_at: { type: Date, default: new Date },
  comments: [Comment]
});

module.exports = Comment;