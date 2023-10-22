const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JobPost = require("../models/jobPost");
const VerifyAuth = require("../middlewares/verifyAuth");

router.post("/job-post", VerifyAuth.checkToken, async (req, res) => {
  try {
    const {
      companyName,
      logoUrl,
      jobPosition,
      salary,
      jobType,
      remote,
      location,
      description,
      aboutCompany,
      skillRequired,
      recruiterName,
    } = req.body;

    const jobPost = new JobPost({
      companyName,
      logoUrl,
      jobPosition,
      salary,
      jobType,
      remote,
      location,
      description,
      aboutCompany,
      skillRequired,
      recruiterName,
    });
    await jobPost.save();
    return res.json({
      message: "JOB POST IS SUCCESSUFULLY",
      name: recruiterName,
    });
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: "something went wrong",
    });
  }
});

router.put("/job-post/:id", VerifyAuth.checkToken, async (req, res) => {
  try {
    const {
      companyName,
      logoUrl,
      jobPosition,
      salary,
      jobType,
      remote,
      location,
      description,
      aboutCompany,
      skillRequired,
      recruiterName,
    } = req.body;
    const { id } = req.params;
    await JobPost.findByIdAndUpdate(id, {
      companyName,
      logoUrl,
      jobPosition,
      salary,
      jobType,
      remote,
      location,
      description,
      aboutCompany,
      skillRequired,
      recruiterName,
    });
    res.json({
      status: "success",
      message: "customer updated successufully",
    });
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: "something went wrong",
    });
  }
});

//create route for filter based on skill and jobTitle
//use find query to return data
//use projection to find query (for specific collection get)

// router.get("/get-jobs",async(req,res)=>{
//     try{

// //         const skillsPatternMatch="react|javascript|css|html|node.js|Express.js|MongoDB";
// //         const positionMatch="full stack developer|frontend developer|backend developer";
// // const getJob=await JobPost.find({
// //    skillRequired:{$regex: new RegExp(skillsPatternMatch,"i")},
// //    jobPosition:{$regex: new RegExp(positionMatch,"i")},  //i for react,React,REACT
// //  },
// //   {jobPosition:1,logoUrl:1,location:1,salary:1,skillRequired:1,remote:1,jobType:1}
// //);

// const gets=await JobPost.find();
// res.status(200).json({
//     status:'success',
// message:"job list show successufully",
// data:gets
// })
// }catch(error){
// res.status(500).json({
//     status:"failed"
// })}
// })

router.get("/get-jobs", async (req, res) => {
  try {
    const { skills, position } = req.query;

    // Construct a query object based on provided skills and position
    const query = {};
    if (skills) {
      query.skillRequired = { $regex: new RegExp(skills, "i") };
    }
    if (position) {
      query.jobPosition = { $regex: new RegExp(position, "i") };
    }

    // Use the query object to filter job data
    const jobs = await JobPost.find(query);

    res.status(200).json({
      status: "success",
      message: "Job list retrieved successfully",
      data: jobs,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "failed",
      message: "Internal Server Error",
    });
  }
});

router.get("/job-description/:id", async (req, res) => {
  try {
    const jobId = req.params.id;
    const jobDetails = await JobPost.findById(jobId);
    //const jobDetails=await JobPost.fing({_id:jobId});
    res.json({
      status: "successuful",
      data: jobDetails,
    });
  } catch (error) {
    console.log(error);
    res.json({ smessage: "something went wrong" });
  }
});

module.exports = router;
