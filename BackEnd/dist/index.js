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
const app = (0, express_1.default)();
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
require("dotenv").config();
const PORT = process.env.PORT || 5000;
const user_1 = __importDefault(require("./routes/user"));
const Admin_1 = __importDefault(require("./routes/Admin"));
const auth_1 = require("./middlewares/auth");
const database_1 = require("./database/database");
const mongodbUri = process.env.MONGODB_URI;
//Other logics
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use("/admin", Admin_1.default);
app.use("/user", user_1.default);
app.get("/", (req, res) => {
    res.send("Welcome to the Coursera");
});
//Single Course Id
app.get("/courses/:courseId", auth_1.authenticateUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const courseId = req.params.courseId;
    // Check if courseId is a valid ObjectId
    if (!mongoose_1.default.Types.ObjectId.isValid(courseId)) {
        return res.status(400).json({ message: "Invalid course ID" });
    }
    try {
        const course = yield database_1.Courses.findById(courseId);
        if (course) {
            res.status(200).json({ course });
        }
        else {
            res.status(404).json({ message: "Course not found" });
        }
    }
    catch (error) {
        console.error("Error fetching course:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}));
//Connection
if (!mongodbUri) {
    console.log("please define a MongoDB connection");
    process.exit(1);
}
mongoose_1.default
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
