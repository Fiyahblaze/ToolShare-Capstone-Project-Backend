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