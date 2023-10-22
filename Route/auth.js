const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;

    if (!name || !email || !mobile || !password) {
      return res.status(400).json({
        error: "Invalid input field",
      });
    }

    const existingEmailUser = await User.findOne({ email: email });
    if (existingEmailUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    //if mobile number is already exist in database
    const existingMobileUser = await User.findOne({ mobile: mobile });
    if (existingMobileUser) {
      return res.status(409).json({
        message: "Mobile number already exists.",
      });
    }

    //protect password
    const hashPassword = await bcrypt.hash(password, 10);

    //create new user
    const user = new User({
      name: name,
      email: email,
      mobile: mobile,
      password: hashPassword,
    });
    //save the user to the database
    await user.save();

    //create the token as a response
    const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRETE, {
      expiresIn: "24",
    });

    //send the token as a response
    res.json({
      message: "user registered successfully",
      jwtToken: jwtToken,
      recruiterName: user.name,
    });
  } catch (error) {
    res.status(500).json({
      error: "internal server error",
    });
  }
});

module.exports = router;
