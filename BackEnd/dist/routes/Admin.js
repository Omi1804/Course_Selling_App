"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secretKey = process.env.JWT_Secret;
const database_1 = require("../database/database");
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
//-----------------------Admin Routes-----------------------//
router.get("/me", auth_1.authenticateUser, (req, res) => {
    const { userEmail } = req.headers;
    const email = userEmail;
    if (email) {
        res.status(200).json({ email });
    }
    else {
        res.status(404).json({ message: "Invalid email" });
    }
});
//Admin singup
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        res
            .status(400)
            .json({ message: "Please Enter your Email or Password Correctly." });
    }
    else {
        const existingUser = yield database_1.Admins.findOne({
            email: email,
            password: password,
        });
        if (existingUser) {
            res.status(400).json({ message: "Admin already exists!" });
        }
        else {
            const obj = { email, password };
            yield database_1.Admins.create(obj);
            if (!secretKey) {
                console.log("Token missing or malformed secret key");
                return res
                    .status(401)
                    .json({ message: "Token missing or malmalformed secret key" });
            }
            const token = jsonwebtoken_1.default.sign(obj, secretKey, {
                expiresIn: "1h",
            });
            res
                .status(200)
                .json({ message: "Admin created successfully", token: token });
        }
    }
}));
//Admin Login
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ message: "Invalid email or password" });
    }
    else {
        const existingUser = yield database_1.Admins.findOne({
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
            const token = jsonwebtoken_1.default.sign({ email, password }, secretKey, {
                expiresIn: "1h",
            });
            res.status(200).json({ message: "Logged in successfully", token: token });
        }
        else {
            res.status(401).json({ message: "Please Signup First!" });
        }
    }
}));
//Admin Creates newer Course
router.post("/course", auth_1.authenticateUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newCourse = req.body;
    yield database_1.Courses.create(newCourse);
    res
        .status(200)
        .json({ message: "Course Created successfully", course: newCourse });
}));
//Admins Edit an existing Course
// router.put("/course/:id", authenticateUser, async (req, res) => {
//   const newCourse = req.body;
//   const courseId = req.params.id;
//   if (!isValidObjectId(courseId)) {
//     return res.status(400).send({ message: "Invalid course ID format" });
//   }
//   try {
//     const existingCourse = await Courses.findOne({ _id: courseId });
//     if (existingCourse) {
//       await Courses.updateOne(existingCourse, newCourse);
//       const updatedCourse = await Courses.findOne({ _id: courseId });
//       res.status(200).json({
//         message: "Course Updated successfully",
//         course: updatedCourse,
//       });
//     } else {
//       res.status(400).send({ message: "Course not found!" });
//     }
//   } catch (err) {
//     console.log("Error updating course " + err);
//     res.status(500).send({ message: "Internal Server Error please try again" });
//   }
// });
router.put("/course/:id", auth_1.authenticateUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newCourseData = req.body;
    const courseId = req.params.id;
    // Validate newCourseData here (e.g., check required fields, types, etc.)
    if (!newCourseData || !courseId) {
        return res.status(400).send({ message: "Invalid course ID format" });
    }
    try {
        const existingCourse = yield database_1.Courses.findById(courseId);
        if (!existingCourse) {
            return res.status(404).send({ message: "Course not found!" });
        }
        try {
            const updatedCourse = yield database_1.Courses.findByIdAndUpdate(courseId, newCourseData, { new: true });
            res.status(200).json({
                message: "Course Updated successfully",
                course: updatedCourse,
            });
        }
        catch (updateError) {
            console.error("Error updating course:", updateError);
            res.status(500).send({ message: "Error updating course" });
        }
    }
    catch (findError) {
        console.error("Error finding course:", findError);
        res.status(500).send({ message: "Internal Server Error" });
    }
}));
//Admin can Excess All the courses
router.get("/course", auth_1.authenticateUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const courses = yield database_1.Courses.find({});
    res.status(200).json(courses);
}));
//Admin can delete the course
router.delete("/course/:courseId", auth_1.authenticateUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const courseId = req.params.courseId;
    try {
        const deleteCourse = yield database_1.Courses.deleteOne({ _id: courseId });
        if (deleteCourse.deletedCount === 0) {
            return res.status(404).json({ message: "Course not found." });
        }
        res.json({ message: "Course successfully deleted." });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error." });
    }
}));
exports.default = router;
