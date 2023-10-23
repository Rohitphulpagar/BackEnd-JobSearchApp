const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../server/models/user");
const auth = require("../server/Route/auth");
const login = require("../server/Route/login");
const jobPost = require("../server/Route/job");
const cors = require("cors");
dotenv.config();

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  cors({
    origin: '*',
  })
);

mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connected.."))
  .catch((error) => console.log("failed to connect mongoDB..", error));

app.get("/health", (req, res) => {
  res.status(200).json({
    service: "job-listing-server",
    status: "active",
    time: new Date(),
  });
});

app.use("/user", auth);
app.use("/user", login);
app.use("/user", jobPost);

app.use((req, res, next) => {
  const err = new Error("Something went wrong! Please try after some time.");
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`server is running on port: ${process.env.PORT}`);
});
