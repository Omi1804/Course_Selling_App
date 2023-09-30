const mongoose = require("mongoose");

//-----------------------Database logics-----------------------//

// Schemas
const adminSchema = new mongoose.Schema({
  email: String,
  password: String,
});
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  purchasedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Courses" }],
});
const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  imageLink: String,
  published: Boolean,
});

// Models
const Admins = mongoose.model("Admins", adminSchema);
const Users = mongoose.model("Users", userSchema);
const Courses = mongoose.model("Courses", courseSchema);

//exporting
module.exports = {
  Admins,
  Users,
  Courses,
};
