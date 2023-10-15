const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const PORT = process.env.PORT || 5000;
const userRouter = require("./routes/user.js");
const adminRouter = require("./routes/Admin.js");
const { authenticateUser } = require("./middlewares/auth.js");
const { Courses } = require("./database/database.js");
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
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
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
