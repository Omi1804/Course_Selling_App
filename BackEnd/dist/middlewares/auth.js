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
exports.authenticateUser2 = exports.authenticateUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = require("../database/database");
const secretKey = process.env.JWT_Secret;
if (!secretKey) {
    throw new Error("JWT Secret Key is not defined in the environment variables.");
}
//-----------------------Authentication logics-----------------------//
const authenticateUser = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "Authorization header missing!" });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Token missing or malformed!" });
    }
    if (!secretKey) {
        console.log("Token missing or malformed secret key");
        return res
            .status(401)
            .json({ message: "Token missing or malmalformed secret key" });
    }
    jsonwebtoken_1.default.verify(token, secretKey, (err, data) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            return res.status(401).json({ message: "Invalid token!" });
        }
        const { email, password } = data;
        // Use hashed password for comparison
        const existingUser = yield database_1.Admins.findOne({
            email: email,
            password: password,
        });
        if (!existingUser) {
            return res.status(403).json({ message: "User not found!" });
        }
        // req.user = data;
        //now we are storing the email and password in the headers
        req.headers["userEmail"] = existingUser.email;
        req.headers["userPassword"] = existingUser.password;
        next();
    }));
};
exports.authenticateUser = authenticateUser;
function authenticateUser2(req, res, next) {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        jsonwebtoken_1.default.verify(token, secretKey, (err, data) => __awaiter(this, void 0, void 0, function* () {
            if (err) {
                res.status(500).json({ message: err.message });
            }
            const { email, password } = data;
            const existingUser = yield database_1.Users.findOne({
                email: email,
                password: password,
            });
            if (existingUser) {
                // req.user = existingUser;
                //now we are storing the email and password in the headers
                req.headers["userEmail"] = existingUser.email;
                req.headers["userPassword"] = existingUser.password;
                next();
            }
            else {
                res.status(403).json({ message: "User does not exist" });
            }
        }));
    }
    else {
        res.status(401).json({ message: "Unauthorized User credentials!" });
    }
}
exports.authenticateUser2 = authenticateUser2;
