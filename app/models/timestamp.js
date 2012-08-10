
var mongoose = require('mongoose');

module.exports = function TimeStamp(schema) {
  
  schema.add({
    created_at: { type: Date, default: new Date },
    modified_at: { type: Date, default: new Date }
  });

  schema.pre('save', function(next) {
    
    if(!this.created_at) {
      this.created_at = this.modified_at = new Date;
    } else {
      this.modified_at = new Date;
    }
    
    next();
  });

};
