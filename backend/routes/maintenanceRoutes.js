const express = require("express");

const {
  createMaintenance,
  getMaintenance,
  getMaintenanceById,
  deleteMaintenance,
  updateMaintenance,
} = require("../controllers/maintenanceController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// Create maintenance request
router.post("/", authMiddleware, createMaintenance);


// Get maintenance requests
router.get("/", authMiddleware, getMaintenance);


// Get single maintenance request
router.get("/:id", authMiddleware, getMaintenanceById);


// Delete maintenance request
router.delete("/:id", authMiddleware, deleteMaintenance);


// Update maintenance request
router.put("/:id", authMiddleware, updateMaintenance);


module.exports = router;