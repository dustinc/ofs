
var Schema = require('mongoose').Schema,
    ObjectId = Schema.ObjectId,
    TimeStamp = require('./timestamp');

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
  user_id: {type: ObjectId, required: true},
  
  education: {
    degrees: [Degree],
    certificates: [CertLic],
    licenses: [CertLic],
    other: String
  },
  
  experience: {
    years_teaching: {type: String, enum: ['0', '1-3', '4-6', '7-10', '11+']},
    delivery_mode: {type: String, enum: ['Face to Face', 'Online', 'Both']},
    years_teaching_online: {type: String, enum: ['0', '1-3', '4-6', '7-10', '11+']},
    courses_taught: [String],
    eligible_areas: [String]
  },
  
  publication: {
    publication_type: Array,
    total: Number,
    past_three_years: Number,
    reviewer: Boolean,
    reviewer_total: Number
  },

  presentation: {
    total: Number,
    past_three_years: Number,
    reviewer: Boolean,
    reviewer_total: Number
  },
  
  services: [Service],

  positions_desired: [String],
  institution: {type: String, enum: ['K12 School', 'Community/Technical College', 'University/College']},
  course: {type: String, enum: ['K12', 'Undergraduate', 'Graduate']}

});

Teacher.plugin(TimeStamp);
