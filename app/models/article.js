
var Schema = require('mongoose').Schema,
    ObjectId = Schema.ObjectId,
    Comment = require('./comment'),
    TimeStamp = require('./timestamp');


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
  is_page: { type: Boolean, default: false },
  is_active : { type: Boolean, default: true }
});

Article.plugin(TimeStamp);

/*
 * Virtuals and Methods
 */

Article.virtual('excerpt').get(function() {
  var md = require('discount');

  if(this.body.length > 20) {
    return md.parse(this.body.substring(0, this.body.lastIndexOf(' ', 20))
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
 * Pre and Post
 */

Article.pre('save', function(next) {
  this.title = this.title.replace(/^\s+|\s+$/g, '');

  if(this.title !== '') {
    this.slug = this.title.replace(/\s+/g, '-').toLowerCase()
      .replace('/(;|\||,|!|@|#|\$|\(|\)|<|>|\/|\"|\'|`|\\\|~|\{|\}|\[|\]|=|\+|\?|&|\*|\^)*/i', '');
  }

  next();
});