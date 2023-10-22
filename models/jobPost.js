const mongoose = require("mongoose");

const JobPostSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
  },
  logoUrl: String,
  jobPosition: {
    type: String,
    required: true,
  },
  salary: Number,
  jobType: String,
  remote: Boolean,
  location: String,
  description: String,
  aboutCompany: String,
  skillRequired: {
    type: String,
    default: "",
  },
  recruiterName: {
    type: String,
    required: true,
  },
});

const JobPost = mongoose.model("JobPost", JobPostSchema);
module.exports = JobPost;
