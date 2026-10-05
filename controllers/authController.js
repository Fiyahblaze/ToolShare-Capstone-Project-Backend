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

async function register(req, res) {
  try {
    const { name, email, password } = req.body || {};

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      return res.status(400).json({
        message: "Name, email, and password are required",
      });
    }

    const user = await User.create({
      name,
      email: normalizedEmail,
      password,
    });

    res.status(201).json({
      message: "Account created successfully",
      token: createToken(user),
      user: userDetails(user),
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Email is already registered" });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: Object.values(error.errors)
          .map((item) => item.message)
          .join(", "),
      });
    }

    console.error("Registration failed:", error.message);
    res.status(500).json({ message: "Unable to create account" });
  }
}