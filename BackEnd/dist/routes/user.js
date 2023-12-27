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
//-----------------------User Routes-----------------------//
//User Singin
router.post("/singin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ message: "Invalid email or password" });
    }
    else {
        const existingUser = yield database_1.Users.findOne({
            email: email,
            password: password,
        });
        if (existingUser) {
            res.status(401).json({ message: "User already exists" });
        }
        else {
            const obj = { email, password };
            yield database_1.Users.create(obj);
            if (!secretKey) {
                console.log("Token missing or malformed secret key");
                return res
                    .status(401)
                    .json({ message: "Token missing or malmalformed secret key" });
            }
            const token = jsonwebtoken_1.default.sign(obj, secretKey, { expiresIn: "1h" });
            res
                .status(200)
                .json({ message: "User signed in successfully.", token: token });
        }
    }
}));
//user Login
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ message: "Invalid email or password!" });
    }
    else {
        const existingUser = yield database_1.Users.findOne({
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
            res
                .status(200)
                .json({ message: "User logged in successfully!", token: token });
        }
        else {
            res.status(401).json({ message: "Please singin first!" });
        }
    }
}));
//List all the courses for User
router.get("/courses", auth_1.authenticateUser2, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const courses = yield database_1.Courses.find({ published: true });
    res.status(200).json(courses);
}));
//User parchase the course
router.post("/courses/:courseId", auth_1.authenticateUser2, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userEmail } = req.headers;
    const { userPassword } = req.headers;
    const courseId = req.params.courseId;
    const existingCourse = yield database_1.Courses.findById(courseId);
    if (existingCourse) {
        const user = yield database_1.Users.findOne({
            email: userEmail,
            password: userPassword,
        });
        if (user) {
            user.purchasedCourses.push(existingCourse);
            yield user.save();
            res.status(200).json({ message: "Course purchased successfully!" });
        }
        else {
            res.status(403).json({ message: "Please singin first!" });
        }
    }
    else {
        res.status(404).json({ message: "Requested Course not found!" });
    }
}));
//User can see all his courses
router.get("/purchasedCourses", auth_1.authenticateUser2, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userEmail } = req.headers;
    const { userPassword } = req.headers;
    const userCourses = yield database_1.Users.findOne({
        email: userEmail,
        password: userPassword,
    }).populate("purchasedCourses");
    res.status(200).json(userCourses.purchasedCourses);
}));
exports.default = router;
