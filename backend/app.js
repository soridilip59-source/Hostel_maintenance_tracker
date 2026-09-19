const express = require("express");

const maintenanceRoutes = require("./routes/maintenanceRoutes");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Hostel Maintenance Tracker API is running",
  });
});

app.use("/api/maintenance", maintenanceRoutes);

module.exports = app;