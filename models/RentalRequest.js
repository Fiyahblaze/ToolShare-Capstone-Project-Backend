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

    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },

       endDate: {
      type: Date,
      required: [true, "End date is required"],
      validate: {
        validator(value) {
          const startDate =
            this instanceof mongoose.Query
              ? this.get("startDate")
              : this.startDate;

          return (
            startDate instanceof Date &&
            !Number.isNaN(startDate.getTime()) &&
            value >= startDate
          );
        },
        message: "End date must be on or after the start date",
      },
    },
    
    message: {
      type: String,
      trim: true,
      maxlength: [500, "Message cannot exceed 500 characters"],
      default: "",
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

rentalRequestSchema.pre("validate", function () {
  if (
    this.owner &&
    this.borrower &&
    this.owner.equals(this.borrower)
  ) {
    this.invalidate(
      "borrower",
      "You cannot request your own tool"
    );
  }
});

module.exports = mongoose.model("RentalRequest", rentalRequestSchema);