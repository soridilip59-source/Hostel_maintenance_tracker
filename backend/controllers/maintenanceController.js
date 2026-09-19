const Maintenance = require("../models/Maintenance");

// Create maintenance request
const createMaintenance = async (req, res) => {
  try {
    const { studentName, roomNumber, issue } = req.body;

    const maintenance = await Maintenance.create({
      studentName,
      roomNumber,
      issue,
    });

    res.status(201).json({
      message: "Maintenance request created successfully",
      data: maintenance,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating maintenance request",
      error: error.message,
    });
  }
};

// Get all maintenance requests
const getMaintenance = async (req, res) => {
  try {
    const maintenance = await Maintenance.find();

    res.status(200).json({
      message: "Maintenance requests fetched successfully",
      data: maintenance,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching maintenance requests",
      error: error.message,
    });
  }
};

// Delete maintenance request
const deleteMaintenance = async (req, res) => {
  try {
    await Maintenance.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Maintenance request deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting maintenance request",
      error: error.message,
    });
  }
};

// Update maintenance request
const updateMaintenance = async (req, res) => {
  try {
    const { status } = req.body;

    const maintenance = await Maintenance.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!maintenance) {
      return res.status(404).json({
        message: "Maintenance request not found",
      });
    }

    res.status(200).json({
      message: "Maintenance request updated successfully",
      data: maintenance,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating maintenance request",
      error: error.message,
    });
  }
};

// Export all controllers
module.exports = {
  createMaintenance,
  getMaintenance,
  deleteMaintenance,
  updateMaintenance,
};