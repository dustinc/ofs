// OFS Schema - a work in progress.
/*
 * This is what will populate form select fields.
 * Made accessible/editable to Administrators.
 * [THIS APPROACH SHOULD BE CAREFULLY CONSIDERED BEFORE IMPLEMENTING]
 */
LookupCollection:
{
  name: String, // user_types
  values: Array // [Administrator, Teacher, Institution]
}//end lookup collection

/*
LookupCollection Values:
  user_types: [Administrator, Teacher, Institution],
  degree_types: [Associates, Bachelors, Masters, Doctorate],
  research_types: [Publication, Presentation],
  publication_types: [Quantitative, Qualitative, Mixed Methods],
  service_types: [Dissertation/Thesis, University/College],
*/

User:
{
  username: String,
  password: String,
  email: String,
  type: String,
  last_login: Date
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
