const mongoose = require("mongoose");

const toolSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "A tool must have an owner"],
      index: true,
    },

    name: {
      type: String,
      required: [true, "Tool name is required"],
      trim: true,
      maxlength: [100, "Tool name cannot exceed 100 characters"],
    },

    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },

    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: [
          "Power Tools",
          "Hand Tools",
          "Garden Tools",
          "Ladders",
          "Cleaning Equipment",
          "Other",
        ],
        message: "Choose a valid tool category",
      },
    },

    condition: {
      type: String,
      required: [true, "Condition is required"],
      enum: {
        values: ["New", "Like New", "Good", "Fair"],
        message: "Choose a valid tool condition",
      },
    },

    dailyRate: {
      type: Number,
      required: [true, "Daily rental rate is required"],
      min: [0, "Daily rental rate cannot be negative"],
      validate: {
        validator: Number.isFinite,
        message: "Daily rental rate must be a finite number",
      },
    },

    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
      maxlength: [150, "Location cannot exceed 150 characters"],
    },

    imageUrl: {
      type: String,
      trim: true,
      default: "",
      maxlength: [2000, "Image URL cannot exceed 2000 characters"],
      validate: {
        validator(value) {
          if (!value) return true;

          try {
            const url = new URL(value);
            return ["http:", "https:"].includes(url.protocol);
          } catch {
            return false;
          }
        },
        message: "Image URL must be a valid HTTP or HTTPS URL",
      },
    },

    available: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Tool", toolSchema);