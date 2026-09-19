const mongoose = require("mongoose");

const maintenanceSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: true,
    },

    roomNumber: {
      type: String,
      required: true,
    },

    issue: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Maintenance", maintenanceSchema);