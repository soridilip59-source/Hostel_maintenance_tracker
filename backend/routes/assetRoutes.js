const express = require("express");

const {
  createAsset,
  getAssets,
  updateAsset,
  deleteAsset
} = require("../controllers/assetController");

const authMiddleware = require("../middleware/authMiddleware");
const requireRole = require("../middleware/requireRole");

const router = express.Router();

router.post("/", authMiddleware, requireRole("admin"), createAsset);

router.get("/", authMiddleware, getAssets);

router.patch("/:id", authMiddleware, requireRole("admin"), updateAsset);

router.delete("/:id", authMiddleware, requireRole("admin"), deleteAsset);

module.exports = router;
