const mongoose = require("mongoose");
const RentalRequest = require("../models/RentalRequest");
const Tool = require("../models/Tool");

function validRequestId(req, res) {
  if (!mongoose.isObjectIdOrHexString(req.params.id)) {
    res.status(400).json({ message: "Invalid rental request ID" });
    return false;
  }

  return true;
}

function handleError(res, error) {
  if (error.name === "ValidationError") {
    const messages = Object.values(error.errors).map(
      (item) => item.message
    );

    return res.status(400).json({
      message: messages.join(", "),
    });
  }

  if (error.name === "CastError") {
    return res.status(400).json({
      message: "Invalid field value",
    });
  }

  console.error("Rental request failed:", error.message);

  return res.status(500).json({
    message: "Unable to process rental request",
  });
}

function parseRentalDates(startDate, endDate) {
  const datePattern = /^\d{4}-\d{2}-\d{2}$/;

  const values = [startDate, endDate];

  for (const value of values) {
    if (typeof value !== "string" || !datePattern.test(value)) {
      throw new Error("Use YYYY-MM-DD for rental dates");
    }
  }

  const start = new Date(`${startDate}T00:00:00.000Z`);
  const end = new Date(`${endDate}T00:00:00.000Z`);

  if (
    Number.isNaN(start.getTime()) ||
    Number.isNaN(end.getTime()) ||
    start.toISOString().slice(0, 10) !== startDate ||
    end.toISOString().slice(0, 10) !== endDate
  ) {
    throw new Error("Enter valid rental dates");
  }

  if (end < start) {
    throw new Error("End date must be on or after the start date");
  }

  return { startDate: start, endDate: end };
}

// Requests submitted by the logged-in borrower
async function getOutgoingRequests(req, res) {
  try {
    const requests = await RentalRequest.find({
      borrower: req.user._id,
    })
      .populate("tool", "name imageUrl dailyRate location")
      .populate("owner", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({ requests });
  } catch (error) {
    return handleError(res, error);
  }
}

// Requests received by the logged-in tool owner
async function getIncomingRequests(req, res) {
  try {
    const requests = await RentalRequest.find({
      owner: req.user._id,
    })
      .populate("tool", "name imageUrl dailyRate location")
      .populate("borrower", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({ requests });
  } catch (error) {
    return handleError(res, error);
  }
}

// View one request if the user is its owner or borrower
async function getRequestById(req, res) {
  if (!validRequestId(req, res)) return;

  try {
    const request = await RentalRequest.findOne({
      _id: req.params.id,
      $or: [
        { owner: req.user._id },
        { borrower: req.user._id },
      ],
    })
      .populate("tool", "name imageUrl dailyRate location")
      .populate("owner", "name")
      .populate("borrower", "name");

    if (!request) {
      return res.status(404).json({
        message: "Rental request not found",
      });
    }

    return res.status(200).json({ request });
  } catch (error) {
    return handleError(res, error);
  }
}

async function createRequest(req, res) {
  const { toolId, startDate, endDate, message } = req.body || {};

  if (!mongoose.isObjectIdOrHexString(toolId)) {
    return res.status(400).json({ message: "Invalid tool ID" });
  }

  if (message !== undefined && typeof message !== "string") {
    return res.status(400).json({ message: "Message must be text" });
  }

  let dates;

  try {
    dates = parseRentalDates(startDate, endDate);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  if (dates.startDate < today) {
    return res.status(400).json({
      message: "Start date cannot be in the past",
    });
  }

  try {
    const tool = await Tool.findById(toolId);

    if (!tool) {
      return res.status(404).json({ message: "Tool not found" });
    }

    if (tool.owner.equals(req.user._id)) {
      return res.status(400).json({
        message: "You cannot request your own tool",
      });
    }

    if (!tool.available) {
      return res.status(409).json({
        message: "This tool is currently unavailable",
      });
    }

    const overlappingRequest = await RentalRequest.findOne({
      tool: tool._id,
      startDate: { $lte: dates.endDate },
      endDate: { $gte: dates.startDate },
      $or: [
        { status: "approved" },
        { status: "pending", borrower: req.user._id },
      ],
    });

    if (overlappingRequest) {
      return res.status(409).json({
        message:
          "These dates overlap an approved rental or your pending request",
      });
    }

    const request = await RentalRequest.create({
      tool: tool._id,
      borrower: req.user._id,
      owner: tool.owner,
      startDate: dates.startDate,
      endDate: dates.endDate,
      message: message || "",
      status: "pending",
    });

    return res.status(201).json({
      message: "Rental request submitted successfully",
      request,
    });
  } catch (error) {
    return handleError(res, error);
  }
}