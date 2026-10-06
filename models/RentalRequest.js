const mongoose = require("mongoose");

const rentalRequestSchema = new mongoose.Schema(
  {
    tool: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tool",
      required: [true, "A rental request must include a tool"],
      index: true,
    },

    borrower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "A rental request must include a borrower"],
      index: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "A rental request must include an owner"],
      index: true,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "approved",
        "declined",
        "cancelled",
        "returned",
      ],
      default: "pending",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RentalRequest", rentalRequestSchema);