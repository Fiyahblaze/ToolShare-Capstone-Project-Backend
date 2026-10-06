const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  getTools,
  getToolById,
  getMyTools,
  createTool,
  updateTool,
  deleteTool,
} = require("../controllers/toolController");

const router = express.Router();

// Keep /mine before /:id so "mine" isn't treated as a tool ID.
router.get("/mine", protect, getMyTools);

// Public routes
router.get("/", getTools);
router.get("/:id", getToolById);

// Routes that require login
router.post("/", protect, createTool);
router.patch("/:id", protect, updateTool);
router.delete("/:id", protect, deleteTool);

module.exports = router;