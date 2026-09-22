const Feedback = require("../models/Feedback");

const createFeedback = async (req, res) => {
  try {
    const { type, rating, message } = req.body;
    if (!type || !message?.trim() || !Number.isInteger(Number(rating)) || Number(rating) < 1 || Number(rating) > 5) {
      return res.status(400).json({ message: "Feedback type, a rating from 1 to 5, and a message are required" });
    }
    const feedback = await Feedback.create({ submittedBy: req.user.id, type: type.trim(), rating: Number(rating), message: message.trim() });
    return res.status(201).json({ message: "Thank you for your feedback", data: feedback });
  } catch (error) {
    return res.status(500).json({ message: "Unable to submit feedback" });
  }
};

const getFeedback = async (req, res) => {
  try {
    const query = req.user.role === "admin" ? {} : { submittedBy: req.user.id };
    const feedback = await Feedback.find(query).sort({ createdAt: -1 }).populate("submittedBy", "name email profileImage");
    return res.json({ message: "Feedback fetched successfully", data: feedback });
  } catch (error) {
    return res.status(500).json({ message: "Unable to load feedback" });
  }
};

module.exports = { createFeedback, getFeedback };
