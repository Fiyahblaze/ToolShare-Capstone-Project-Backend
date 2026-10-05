const jwt = require("jsonwebtoken");
const User = require("../models/User");

function createToken(user) {
  return jwt.sign(
    { userId: user._id.toString() },
    process.env.JWT_SECRET,
    { expiresIn: "1h", algorithm: "HS256" }
  );
}

function userDetails(user) {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
  };
}

