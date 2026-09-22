const express = require("express");
const cors = require("cors");

const maintenanceRoutes = require("./routes/maintenanceRoutes");
const assetRoutes = require("./routes/assetRoutes");
const authRoutes = require("./routes/authRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");

const app = express();

const corsOptions = process.env.CLIENT_URL
  ? {
      origin: process.env.CLIENT_URL,
    }
  : undefined;

app.use(cors(corsOptions));
app.use(express.json({ limit: "4mb" }));

app.get("/", (req, res) => {
  res.json({
    message: "Hostel Maintenance API is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/maintenance", maintenanceRoutes);
app.use("/api/assets", assetRoutes);
app.use("/api/feedback", feedbackRoutes);

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

module.exports = app;
