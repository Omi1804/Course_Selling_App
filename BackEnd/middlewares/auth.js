const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_Secret;
const { Admins, Users } = require("../database/database.js");

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

  jwt.verify(token, secretKey, async (err, data) => {
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

    req.user = data;
    next();
  });
};

function authenticateUser2(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, secretKey, async (err, data) => {
      if (err) {
        res.status(500).json({ message: err.message });
      }

      const { email, password } = data;
      const existingUser = await Users.findOne({
        email: email,
        password: password,
      });
      if (existingUser) {
        req.user = existingUser;
        next();
      } else {
        res.status(403).json({ message: "User does not exist" });
      }
    });
  } else {
    res.status(401).json({ message: "Unauthorized User credentials!" });
  }
}

module.exports = {
  authenticateUser,
  authenticateUser2,
};
