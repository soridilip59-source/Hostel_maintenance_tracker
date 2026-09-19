const Asset = require("../models/Asset");

const sendAssetError = (res, error, fallbackMessage) => {
  if (error.code === 11000) {
    return res.status(400).json({ message: "Asset code already exists" });
  }

  if (error.name === "ValidationError" || error.name === "CastError") {
    return res.status(400).json({ message: error.message });
  }

  return res.status(500).json({ message: fallbackMessage });
};

// Create asset
const createAsset = async (req, res) => {
  try {
    const {
      name,
      assetCode,
      category,
      hostel,
      room,
      condition,
    } = req.body;

    if (!name || !assetCode || !category || !hostel || !room) {
      return res.status(400).json({
        message: "Name, asset code, category, hostel and room are required",
      });
    }

    const existingAsset = await Asset.findOne({ assetCode });

    if (existingAsset) {
      return res.status(400).json({
        message: "Asset code already exists",
      });
    }

    const asset = await Asset.create({
      name,
      assetCode,
      category,
      hostel,
      room,
      condition,
    });

    res.status(201).json({
      message: "Asset created successfully",
      data: asset,
    });
  } catch (error) {
    return sendAssetError(res, error, "Error creating asset");
  }
};


// Get all assets
const getAssets = async (req, res) => {
  try {
    const assets = await Asset.find().sort({ hostel: 1, room: 1, name: 1 });

    res.status(200).json({
      message: "Assets fetched successfully",
      data: assets,
    });
  } catch (error) {
    return sendAssetError(res, error, "Error fetching assets");
  }
};


// Update asset
const updateAsset = async (req, res) => {
  try {
    const asset = await Asset.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!asset) {
      return res.status(404).json({
        message: "Asset not found",
      });
    }

    res.status(200).json({
      message: "Asset updated successfully",
      data: asset,
    });
  } catch (error) {
    return sendAssetError(res, error, "Error updating asset");
  }
};


// Delete asset
const deleteAsset = async (req, res) => {
  try {
    const asset = await Asset.findByIdAndDelete(req.params.id);

    if (!asset) {
      return res.status(404).json({
        message: "Asset not found",
      });
    }

    res.status(200).json({
      message: "Asset deleted successfully",
    });
  } catch (error) {
    return sendAssetError(res, error, "Error deleting asset");
  }
};


module.exports = {
  createAsset,
  getAssets,
  updateAsset,
  deleteAsset,
};
