
var Schema = require('mongoose').Schema,
    ObjectId = Schema.ObjectId,
    TimeStamp = require('./timestamp');


/*
 * Article Schema
 */

var Article = module.exports = new Schema({
  title : { type: String, required: true },
  body : { type: String, required: true },
  is_active : { type: Boolean, default: true },
  sequence: Number,
  prev_article_id: ObjectId,
  next_article_id: ObjectId,
  categories: [String]
});

Article.plugin(TimeStamp);

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
  return md.parse(this.body);
});

Article.pre('save', function(next) {
  
  if(this.isNew) {
    var that = this;
    var prev_id;
    
    this.model('Article').findOne({ 'sequence': this.sequence - 1}, function(err, _a) {
      
      if(err) return next(err);
      
      if(null == _a) return next();
      
      that.prev_article_id = _a._id;
      
      _a.next_article_id = that._id;
      
      _a.save(function(err) {
        if(err) return next(err);
      });
      next()
    });
    
  } else {
    next();
  }
  
});








