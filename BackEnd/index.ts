import express from "express";
const app = express();
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
require("dotenv").config();
const PORT = process.env.PORT || 5000;
import userRouter from "./routes/user";
import adminRouter from "./routes/Admin";
import { authenticateUser } from "./middlewares/auth";
import { Courses } from "./database/database";
const mongodbUri = process.env.MONGODB_URI;
//Other logics

app.use(cors());
app.use(bodyParser.json());

app.use("/admin", adminRouter);
app.use("/user", userRouter);

app.get("/", (req, res) => {
  res.send("Welcome to the Coursera");
});

//Single Course Id
app.get("/courses/:courseId", authenticateUser, async (req, res) => {
  const courseId = req.params.courseId;

  // Check if courseId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    return res.status(400).json({ message: "Invalid course ID" });
  }

  try {
    const course = await Courses.findById(courseId);

    if (course) {
      res.status(200).json({ course });
    } else {
      res.status(404).json({ message: "Course not found" });
    }
  } catch (error) {
    console.error("Error fetching course:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//Connection
if (!mongodbUri) {
  console.log("please define a MongoDB connection");
  process.exit(1);
}
mongoose
  .connect(mongodbUri, {
    dbName: "mernCourse",
  })
  .then(() => {
    console.log("Database Connected Successfully");
  })
  .catch((err) => {
    console.log("Error connecting to database " + err);
  });

//Hosting configuration
app.listen(PORT, () => {
  console.log("Listening on port " + PORT);
});
