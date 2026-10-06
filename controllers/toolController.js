const mongoose = require("mongoose");
const Tool = require("../models/Tool");

const editableFields = [
  "name",
  "description",
  "category",
  "condition",
  "dailyRate",
  "location",
  "imageUrl",
  "available",
];

function getToolFields(body) {
  const fields = {};

  for (const field of editableFields) {
    if (Object.prototype.hasOwnProperty.call(body, field)) {
      fields[field] = body[field];
    }
  }

  return fields;
}

function handleError(res, error) {
  if (error.name === "ValidationError") {
    const messages = Object.values(error.errors).map(
      (item) => item.message
    );

    return res.status(400).json({ message: messages.join(", ") });
  }

  if (error.name === "CastError") {
    return res.status(400).json({ message: "Invalid field value" });
  }

  console.error("Tool operation failed:", error.message);

  return res.status(500).json({
    message: "Unable to process tool listing",
  });
}

function validToolId(req, res) {
  if (!mongoose.isObjectIdOrHexString(req.params.id)) {
    res.status(400).json({ message: "Invalid tool ID" });
    return false;
  }

  return true;
}
// Read all tool listings
async function getTools(req, res) {
  try {
    const tools = await Tool.find()
      .populate("owner", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({ tools });
  } catch (error) {
    return handleError(res, error);
  }
}

// Read one tool listing
async function getToolById(req, res) {
  if (!validToolId(req, res)) return;

  try {
    const tool = await Tool.findById(req.params.id)
      .populate("owner", "name");

    if (!tool) {
      return res.status(404).json({
        message: "Tool not found",
      });
    }

    return res.status(200).json({ tool });
  } catch (error) {
    return handleError(res, error);
  }
}

// Read the logged-in user's listings
async function getMyTools(req, res) {
  try {
    const tools = await Tool.find({ owner: req.user._id })
      .sort({ createdAt: -1 });

    return res.status(200).json({ tools });
  } catch (error) {
    return handleError(res, error);
  }
}