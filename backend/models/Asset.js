const mongoose = require("mongoose");

const assetSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    assetCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: 100,
    },

    category: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    hostel: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    room: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
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
