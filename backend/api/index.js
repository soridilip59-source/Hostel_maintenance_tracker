require("dotenv").config();

const app = require("../app");
const connectDB = require("../config/db");

module.exports = async (req, res) => {
  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ message: "Server authentication is not configured" });
  }

  try {
    await connectDB();
    return app(req, res);
  } catch (error) {
    console.error(`Database connection failed: ${error.message}`);
    return res.status(503).json({ message: "Database is temporarily unavailable" });
  }
};
