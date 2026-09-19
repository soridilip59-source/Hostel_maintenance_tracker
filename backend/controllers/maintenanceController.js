const Maintenance = require("../models/Maintenance");

// Create maintenance request
const createMaintenance = async (req, res) => {
  try {
    const { assetId, description } = req.body;

    if (!assetId || !description) {
      return res.status(400).json({
        message: "Asset and description are required",
      });
    }

    const maintenance = await Maintenance.create({
      assetId,
      reportedBy: req.user.id,
      description,
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
        .populate("assetId")
        .populate("reportedBy", "name email");
    } else {
      // Student can see only their own requests
      maintenance = await Maintenance.find({
        reportedBy: req.user.id,
      })
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
    const maintenance = await Maintenance.findByIdAndDelete(
      req.params.id
    );

    if (!maintenance) {
      return res.status(404).json({
        message: "Maintenance request not found",
      });
    }

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

    const maintenance = await Maintenance.findByIdAndUpdate(
      req.params.id,
      {
        status,
        resolutionNote,
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