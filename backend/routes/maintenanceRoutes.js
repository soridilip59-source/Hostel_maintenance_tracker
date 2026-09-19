const express = require("express");

const {
  createMaintenance,
  getMaintenance,
  deleteMaintenance,
  updateMaintenance,
} = require("../controllers/maintenanceController");

const router = express.Router();

// Create maintenance request
router.post("/", createMaintenance);

// Get all maintenance requests
router.get("/", getMaintenance);

// Delete maintenance request
router.delete("/:id", deleteMaintenance);

// Update maintenance request
router.patch("/:id", updateMaintenance);

module.exports = router;