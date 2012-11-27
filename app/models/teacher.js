
var Schema = require('mongoose').Schema,
    ObjectId = Schema.ObjectId,
    TimeStamp = require('./timestamp'),
    _ = require('underscore');

/*
 * Degree Schema
 */

var Degree = new Schema({
  degree_type: String,
  field: String,
  year: String
});


/*
 * Certificate & License Schema
 */

var CertLic = new Schema({
  name: String,
  year: String
});


/*
 * Service Schema
 */

var Service = new Schema({
  service_type: String,
  name: String,
  description: String,
  year: String
});


/*
 * Teacher Profile
 */

var Teacher = module.exports = new Schema({
  user_id: {type: ObjectId, ref: 'User', required: true},

  education: {
    degrees: [Degree],
    certificates: [CertLic],
    licenses: [CertLic],
    other: String
  },

  experience: {
    years_teaching: {type: String},
    delivery_mode: {type: String},
    years_teaching_online: {type: String},
    courses_taught: [String],
    eligible_areas: [String]
  },

  research_type: Array,

  publication: {
    total: String,
    past_three_years: String,
    reviewer: Boolean,
    reviewer_total: String
  },

  presentation: {
    total: String,
    past_three_years: String,
    reviewer: Boolean,
    reviewer_total: String
  },

  services: [Service],

  positions_desired: [String],
  institutions: [String],
  courses: [String]

});

Teacher.plugin(TimeStamp);

// Virtuals

Teacher.virtual('highest_degree').get(function() {
  var weights = {
    'Doctorates' : 100,
    'Masters' : 10,
    'Bachelors' : 1
  };

  return this.education.degrees.sort(function(a, b) {
    return weights[b.degree_type] - weights[a.degree_type];
  })[0].degree_type;
});

// PRE Hooks

Teacher.pre('save', function(next) {

  if(_.isArray(this.experience.eligible_areas)) {
    this.model('Lookup').pushToLookup(this.experience.eligible_areas, 'Eligible Areas');
  }

  if(_.isArray(this.experience.courses_taught)) {
    this.model('Lookup').pushToLookup(this.experience.courses_taught, 'Courses Taught');
  }

  next();
});