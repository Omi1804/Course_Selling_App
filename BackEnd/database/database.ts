import mongoose from "mongoose";

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
export const Admins = mongoose.model("Admins", adminSchema);
export const Users = mongoose.model("Users", userSchema);
export const Courses = mongoose.model("Courses", courseSchema);
