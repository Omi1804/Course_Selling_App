"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Courses = exports.Users = exports.Admins = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
//-----------------------Database logics-----------------------//
// Schemas
const adminSchema = new mongoose_1.default.Schema({
    email: String,
    password: String,
});
const userSchema = new mongoose_1.default.Schema({
    email: String,
    password: String,
    purchasedCourses: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Courses" }],
});
const courseSchema = new mongoose_1.default.Schema({
    title: String,
    description: String,
    price: Number,
    imageLink: String,
    published: Boolean,
});
// Models
exports.Admins = mongoose_1.default.model("Admins", adminSchema);
exports.Users = mongoose_1.default.model("Users", userSchema);
exports.Courses = mongoose_1.default.model("Courses", courseSchema);
