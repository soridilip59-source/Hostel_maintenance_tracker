const express = require("express");

const {
  createAsset,
  getAssets,
  updateAsset,
  deleteAsset
} = require("../controllers/assetController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createAsset);

router.get("/", authMiddleware, getAssets);

router.patch("/:id", authMiddleware, updateAsset);

router.delete("/:id", authMiddleware, deleteAsset);

module.exports = router;