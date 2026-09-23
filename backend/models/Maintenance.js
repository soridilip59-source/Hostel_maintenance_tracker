const mongoose = require("mongoose");

const maintenanceSchema = new mongoose.Schema(
  {
    assetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Asset",
      required: true,
    },

    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },

    status: {
      type: String,
      enum: ["Pending", "In Progress", "Resolved"],
      default: "Pending",
    },

    resolutionNote: {
      type: String,
      default: "",
      trim: true,
      maxlength: 2000,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Maintenance", maintenanceSchema);
