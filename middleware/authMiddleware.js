const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/User");

async function protect(req, res, next) {
  const authorization = req.get("Authorization") || "";
  const match = authorization.match(/^Bearer\s+(\S+)$/i);

  if (!match) {
    return res.status(401).json({ message: "Login required" });
  }

  let decoded;

  try {
    decoded = jwt.verify(match[1], process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });
  } catch {
    return res.status(401).json({
      message: "Invalid or expired token. Please log in again",
    });
  }

  if (
    typeof decoded.userId !== "string" ||
    !mongoose.isObjectIdOrHexString(decoded.userId)
  ) {
    return res.status(401).json({ message: "Invalid token" });
  }

  try {
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: "Account no longer exists" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication failed:", error.message);
    res.status(500).json({ message: "Unable to verify account" });
  }
}

module.exports = protect;