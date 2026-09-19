const Asset = require("../models/Asset");

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
    res.status(500).json({
      message: "Error creating asset",
      error: error.message,
    });
  }
};


// Get all assets
const getAssets = async (req, res) => {
  try {
    const assets = await Asset.find();

    res.status(200).json({
      message: "Assets fetched successfully",
      data: assets,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching assets",
      error: error.message,
    });
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
    res.status(500).json({
      message: "Error updating asset",
      error: error.message,
    });
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
    res.status(500).json({
      message: "Error deleting asset",
      error: error.message,
    });
  }
};


module.exports = {
  createAsset,
  getAssets,
  updateAsset,
  deleteAsset,
};