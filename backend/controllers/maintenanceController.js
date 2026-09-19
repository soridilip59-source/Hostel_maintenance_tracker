const Maintenance = require("../models/Maintenance");
const Asset = require("../models/Asset");
const mongoose = require("mongoose");

// Create maintenance request
const createMaintenance = async (req, res) => {
  try {
    const { assetId, description } = req.body;

    if (!assetId || !description?.trim()) {
      return res.status(400).json({
        message: "Asset and description are required",
      });
    }

    if (!mongoose.isValidObjectId(assetId)) {
      return res.status(400).json({ message: "Please select a valid asset" });
    }

    const asset = await Asset.findById(assetId);
    if (!asset) {
      return res.status(404).json({ message: "Selected asset was not found" });
    }

    const maintenance = await Maintenance.create({
      assetId,
      reportedBy: req.user.id,
      description: description.trim(),
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


// Get maintenance requests
const getMaintenance = async (req, res) => {
  try {
    let maintenance;

    if (req.user.role === "admin") {
      // Admin can see all requests
      maintenance = await Maintenance.find()
        .sort({ createdAt: -1 })
        .populate("assetId")
        .populate("reportedBy", "name email");
    } else {
      // Student can see only their own requests
      maintenance = await Maintenance.find({
        reportedBy: req.user.id,
      })
        .sort({ createdAt: -1 })
        .populate("assetId")
        .populate("reportedBy", "name email");
    }

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


// Get single maintenance request
const getMaintenanceById = async (req, res) => {
  try {
    const maintenance = await Maintenance.findById(req.params.id)
      .populate("assetId")
      .populate("reportedBy", "name email");

    if (!maintenance) {
      return res.status(404).json({
        message: "Maintenance request not found",
      });
    }

    if (
      req.user.role !== "admin" &&
      maintenance.reportedBy._id.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "You do not have permission to view this request" });
    }

    res.status(200).json({
      message: "Maintenance request fetched successfully",
      data: maintenance,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching maintenance request",
      error: error.message,
    });
  }
};


// Delete maintenance request
const deleteMaintenance = async (req, res) => {
  try {
    const maintenance = await Maintenance.findById(req.params.id);

    if (!maintenance) {
      return res.status(404).json({
        message: "Maintenance request not found",
      });
    }

    if (
      req.user.role !== "admin" &&
      maintenance.reportedBy.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "You do not have permission to delete this request" });
    }

    await maintenance.deleteOne();

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
    const { status, resolutionNote } = req.body;

    if (!["Pending", "In Progress", "Resolved"].includes(status)) {
      return res.status(400).json({ message: "Please select a valid status" });
    }

    if (status === "Resolved" && !resolutionNote?.trim()) {
      return res.status(400).json({ message: "A resolution note is required when resolving a request" });
    }

    const maintenance = await Maintenance.findByIdAndUpdate(
      req.params.id,
      {
        status,
        resolutionNote: resolutionNote?.trim() || "",
      },
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("assetId")
      .populate("reportedBy", "name email");

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


// Export controllers
module.exports = {
  createMaintenance,
  getMaintenance,
  getMaintenanceById,
  deleteMaintenance,
  updateMaintenance,
};
