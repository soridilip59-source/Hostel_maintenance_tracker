const express = require("express");

const {
  createMaintenance,
  getMaintenance,
  getMaintenanceById,
  deleteMaintenance,
  updateMaintenance,
} = require("../controllers/maintenanceController");

const authMiddleware = require("../middleware/authMiddleware");
const requireRole = require("../middleware/requireRole");

const router = express.Router();


// Create maintenance request
router.post("/", authMiddleware, requireRole("student"), createMaintenance);


// Get maintenance requests
router.get("/", authMiddleware, getMaintenance);


// Get single maintenance request
router.get("/:id", authMiddleware, getMaintenanceById);


// Delete maintenance request
router.delete("/:id", authMiddleware, deleteMaintenance);


// Update maintenance request
router.put("/:id", authMiddleware, requireRole("admin"), updateMaintenance);


module.exports = router;
