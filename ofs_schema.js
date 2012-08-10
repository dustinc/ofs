// OFS Schema - a work in progress.
/*
 * This is what will populate form select fields.
 * Made accessible/editable to Administrators.
 * [THIS APPROACH SHOULD BE CAREFULLY CONSIDERED BEFORE IMPLEMENTING]
 */
LookupCollection:
{
  
  user_types: Array [Administrator, Teacher, Institution],
  
  degree_types: Array [Associates, Bachelors, Masters, Doctorate],
  
  research_type: Array [Publication, Presentation],
  publication_type: Array [Quantitative, Qualitative, Mixed Methods],
  service_type: Array [Dissertation/Thesis, University/College],
  
  
  
};//end lookup collection

User:
{
  username: String,
  password: String,
  email: String,
  type: String
};//end user

InstitutionProfile:
{
  name: String,
  primary_contact:,
  
  website: String,
  address: {
    street: String,
    city: String,
    postal_code: String,
    country: String,
  },
  tags: Array []
};//end institution profile

TeacherProfile:
{
  
  user_id: ObjectId, // "FK" to User
  
  credentials: {
    
    degrees: {
      type: String,
      field: String,
      year: Date
    },
    
    //consolidate certificates & license?
    certificates: {
      name: String,
      year: Date
    },
    
    license: {
      name: String,
      year: Date
    },
    
    other_education: String
  },
  
  experience: {
    years_teaching: Number, // how to keep Number yet include n+ e.g., 11+
    years_teaching_online: Number,
    courses_taught: Array,
    eligible_areas: Array
  },
  
  research: {
    type: String,
    publication_type: String,
    number_total: Number,
    number_past_3: Number,
    reviewer: Boolean,
    reviewer_total: Number
  },
    
  
  services: {
    type: String,
    name: String,
    description: String,
    years: Date
  },
  
  
};//end teacher profile
