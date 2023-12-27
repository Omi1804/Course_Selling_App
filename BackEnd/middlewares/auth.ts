import jwt from "jsonwebtoken";
import { Admins, Users } from "../database/database";
import { Request, Response, NextFunction } from "express";

const secretKey = process.env.JWT_Secret as string;
if (!secretKey) {
  throw new Error(
    "JWT Secret Key is not defined in the environment variables."
  );
}

//-----------------------Authentication logics-----------------------//
const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
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

  jwt.verify(token, secretKey, async (err, data: any) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token!" });
    }

    const { email, password } = data;

    // Use hashed password for comparison
    const existingUser = await Admins.findOne({
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
  });
};

function authenticateUser2(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, secretKey, async (err, data: any) => {
      if (err) {
        res.status(500).json({ message: err.message });
      }

      const { email, password } = data;
      const existingUser = await Users.findOne({
        email: email,
        password: password,
      });
      if (existingUser) {
        // req.user = existingUser;

        //now we are storing the email and password in the headers
        req.headers["userEmail"] = existingUser.email;
        req.headers["userPassword"] = existingUser.password;
        next();
      } else {
        res.status(403).json({ message: "User does not exist" });
      }
    });
  } else {
    res.status(401).json({ message: "Unauthorized User credentials!" });
  }
}

export { authenticateUser, authenticateUser2 };
