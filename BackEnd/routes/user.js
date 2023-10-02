const express = require("express");
const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_Secret;
const { Users, Courses } = require("../database/database.js");
const { authenticateUser2 } = require("../middlewares/auth");

const router = express.Router();

//-----------------------User Routes-----------------------//

//User Singin
router.post("/singin", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ message: "Invalid email or password" });
  } else {
    const existingUser = await Users.findOne({
      email: email,
      password: password,
    });

    if (existingUser) {
      res.status(401).json({ message: "User already exists" });
    } else {
      const obj = { email, password };
      await Users.create(obj);
      const token = jwt.sign(obj, secretKey, { expiresIn: "1h" });
      res
        .status(200)
        .json({ message: "User signed in successfully.", token: token });
    }
  }
});

//user Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ message: "Invalid email or password!" });
  } else {
    const existingUser = await Users.findOne({
      email: email,
      password: password,
    });
    if (existingUser) {
      const token = jwt.sign({ email, password }, secretKey, {
        expiresIn: "1h",
      });
      res
        .status(200)
        .json({ message: "User logged in successfully!", token: token });
    } else {
      res.status(401).json({ message: "Please singin first!" });
    }
  }
});

//List all the courses for User
router.get("/courses", authenticateUser2, async (req, res) => {
  const courses = await Courses.find({ published: true });
  res.status(200).json(courses);
});

//User parchase the course
router.post("/courses/:courseId", authenticateUser2, async (req, res) => {
  const courseId = req.params.courseId;
  const existingCourse = await Courses.findById(courseId);
  if (existingCourse) {
    const user = await Users.findOne({
      email: req.user.email,
      password: req.user.password,
    });
    if (user) {
      user.purchasedCourses.push(existingCourse);
      await user.save();
      res.status(200).json({ message: "Course purchased successfully!" });
    } else {
      res.status(403).json({ message: "Please singin first!" });
    }
  } else {
    res.status(404).json({ message: "Requested Course not found!" });
  }
});

//User can see all his courses
router.get("/purchasedCourses", authenticateUser2, async (req, res) => {
  const userCourses = await Users.findOne({
    email: req.user.email,
    password: req.user.password,
  }).populate("purchasedCourses");
  res.status(200).json(userCourses.purchasedCourses);
});

module.exports = router;
