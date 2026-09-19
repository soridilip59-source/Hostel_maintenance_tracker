const mongoose = require("mongoose");

const assetSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    category: {
      type: String,
      required: true,
      trim: true
    },

    quantity: {
      type: Number,
      required: true,
      min: 0
    },

    condition: {
      type: String,
      enum: ["Good", "Damaged", "Needs Repair"],
      default: "Good"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Asset", assetSchema);