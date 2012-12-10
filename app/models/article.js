
var Schema = require('mongoose').Schema,
    ObjectId = Schema.ObjectId,
    Comment = require('./comment'),
    TimeStamp = require('./timestamp'),
    _ = require('underscore');


/*
 * Article Schema
 */

var Article = module.exports = new Schema({
  title : { type: String, required: true },
  body : { type: String, required: true },
  slug: String,
  sequence: Number,
  categories: [String],
  comments: [Comment],
  files: [{
    _id: { type: ObjectId, require: true },
    name: { type: String, required: true }
  }],
  has_files: { type: Boolean, default: false },
  allow_comments: { type: Boolean, default: true },
  is_active : { type: Boolean, default: true }
});

Article.plugin(TimeStamp);

/*
 * Virtuals and Methods
 */

Article.virtual('excerpt').get(function() {
  var md = require('discount');

  if(this.body.length > 20) {
    return md.parse(this.body.substring(0, this.body.lastIndexOf(' ', 150))
      + '...' + "<a href='/article/"+this._id+"'>read more</a>");
  }

  return md.parse(this.body);
});

Article.virtual('content').get(function() {
  var md = require('discount');
  if(this.body)
    return md.parse(this.body);
  return '';
});


/*
 * Methods and Statics
 */

Article.methods.removeComment = function(comment_id, callback) {

  // This whole things feels like a complete hack

  var findAndRemove = function(comments, comment_id) {

    var removed = false;

    // Loop this set of comments
    _.each(comments, function(c) {

      if(c._id == comment_id) {
        // Comment found - now remove
        comments = _.without(comments, c);
        removed = true;
      } else if(!removed && _.isArray(c.comments) && c.comments.length > 0) {
        // Search next branch
        c.comments = findAndRemove(c.comments, comment_id);
      }

    });

    return comments;
  };

  // Remove Needle from Haystack
  if(this.comments = findAndRemove(this.comments, comment_id)) {
    // Return Haystack
    return callback(this.comments);
  }

};


/*
 * Pre and Post
 */

Article.pre('save', function(next) {
  this.title = this.title.replace(/^\s+|\s+$/g, '');

  if(this.title !== '') {
    this.slug = this.title
      .replace(/(;|\||,|!|@|#|\$|\(|\)|<|>|\/|\"|\'|`|\\\|~|\{|\}|\[|\]|=|\+|\?|&|\*|\^)*/gi, '')
      .replace(/\s+/g, '-').toLowerCase();
  }

  next();
});