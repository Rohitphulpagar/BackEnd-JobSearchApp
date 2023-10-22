const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    //check if the email exist int he database
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    //compare password present in the database

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({
        message: "Invalid password",
      });
    }

    //generate token only if user  login
    const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRETE, {
      expiresIn: "24h",
    });

    // send token as a response
    res.json({
      status: "success",
      message: "Login successfully",
      jwtToken: jwtToken,
      recruiterName: user.name,
    });
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: "internal servaer error",
    });
  }
});

module.exports = router;
