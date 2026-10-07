const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/database");
const authRoutes = require("./routes/authRoutes");
const toolRoutes = require("./routes/toolRoutes");
const rentalRequestRoutes = require("./routes/rentalRequestRoutes");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "ToolShare API is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/tools", toolRoutes);
app.use("/api/requests", rentalRequestRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((error, req, res, next) => {
  if (error.type === "entity.parse.failed") {
    return res.status(400).json({ message: "Invalid JSON request body" });
  }

  if (error.type === "entity.too.large") {
    return res.status(413).json({ message: "Request body is too large" });
  }

  console.error("Request failed:", error.message);
  res.status(500).json({ message: "Something went wrong" });
});

async function startServer() {
  try {
    if (
      !process.env.JWT_SECRET ||
      process.env.JWT_SECRET.length < 32 ||
      process.env.JWT_SECRET === "replace_with_a_random_secret"
    ) {
      throw new Error("Set JWT_SECRET to a generated secret in .env");
    }

    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
}

startServer();