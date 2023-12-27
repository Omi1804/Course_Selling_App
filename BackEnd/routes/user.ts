import express from "express";
import jwt from "jsonwebtoken";
const secretKey = process.env.JWT_Secret;
import { Users, Courses } from "../database/database";
import { authenticateUser2 } from "../middlewares/auth";

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
      if (!secretKey) {
        console.log("Token missing or malformed secret key");
        return res
          .status(401)
          .json({ message: "Token missing or malmalformed secret key" });
      }
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
      if (!secretKey) {
        console.log("Token missing or malformed secret key");
        return res
          .status(401)
          .json({ message: "Token missing or malmalformed secret key" });
      }
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
  const { userEmail } = req.headers;
  const { userPassword } = req.headers;
  const courseId = req.params.courseId;
  const existingCourse = await Courses.findById(courseId);
  if (existingCourse) {
    const user = await Users.findOne({
      email: userEmail,
      password: userPassword,
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
  const { userEmail } = req.headers;
  const { userPassword } = req.headers;
  const userCourses = await Users.findOne({
    email: userEmail,
    password: userPassword,
  }).populate("purchasedCourses");
  if (userCourses) {
    res.status(200).json(userCourses.purchasedCourses);
  }
});

export default router;
