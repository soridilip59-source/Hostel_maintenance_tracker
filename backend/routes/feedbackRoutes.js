const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { createFeedback, getFeedback } = require("../controllers/feedbackController");

const router = express.Router();
router.route("/").get(authMiddleware, getFeedback).post(authMiddleware, createFeedback);
module.exports = router;
