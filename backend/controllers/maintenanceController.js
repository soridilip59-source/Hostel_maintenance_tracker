const Maintenance = require("../models/Maintenance");

// Create maintenance request
const createMaintenance = async (req, res) => {
  try {
    const { description, title, category, location, image, hostel, roomNumber } = req.body;
    const selectedRoom = roomNumber || location;
    const selectedHostel = hostel?.trim();

    if (!description?.trim() || !category?.trim() || !selectedRoom?.trim()) {
      return res.status(400).json({
        message: "Hostel, room number, category and issue details are required",
      });
    }

    if (!/^\d+$/.test(selectedRoom.trim())) {
      return res.status(400).json({ message: "Room number must contain digits only" });
    }

    if (selectedHostel && !["Boys Hostel", "Girls Hostel"].includes(selectedHostel)) {
      return res.status(400).json({ message: "Please select a valid hostel" });
    }

    if (image && (!/^data:image\/(jpeg|png|webp);base64,/.test(image) || image.length > 3_000_000)) {
      return res.status(400).json({ message: "Please upload a JPG, PNG, or WebP image smaller than 2 MB" });
    }

    const maintenance = await Maintenance.create({
      reportedBy: req.user.id,
      description: description.trim(),
      title: title?.trim() || `${category.trim()} issue`,
      category: category.trim(),
      location: selectedHostel ? `${selectedHostel} | Room ${selectedRoom.trim()}` : selectedRoom.trim(),
      image: image || "",
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

    if (!["Pending", "In Progress", "In Process", "Resolved", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Please select a valid status" });
    }

    if (["Resolved", "Rejected"].includes(status) && !resolutionNote?.trim()) {
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
