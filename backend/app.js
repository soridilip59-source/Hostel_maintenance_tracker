const express = require("express");

const maintenanceRoutes = require("./routes/maintenanceRoutes");
const assetRoutes = require("./routes/assetRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();
const cors = require("cors");

const corsOptions = process.env.CLIENT_URL ? { origin: process.env.CLIENT_URL } : undefined;

app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Hostel Maintenance API is running"
  });
});

// Auth routes
app.use("/api/auth", authRoutes);

// Maintenance routes
app.use("/api/maintenance", maintenanceRoutes);

// Asset routes
app.use("/api/assets", assetRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

module.exports = app;
