const mongoose = require("mongoose");

const assetSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    assetCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    hostel: {
      type: String,
      required: true,
      trim: true,
    },

    room: {
      type: String,
      required: true,
      trim: true,
    },

    condition: {
      type: String,
      enum: ["Good", "Damaged", "Needs Repair"],
      default: "Good",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Asset", assetSchema);