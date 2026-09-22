const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { rateLimit } = require("express-rate-limit");

const maintenanceRoutes = require("./routes/maintenanceRoutes");
const assetRoutes = require("./routes/assetRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

const allowedOrigins = (process.env.CLIENT_URL || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    // Requests without an Origin header include server-to-server health checks.
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Origin is not allowed by CORS"));
  },
};

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { message: "Too many requests. Please try again later." },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { message: "Too many login attempts. Please try again later." },
});

app.disable("x-powered-by");
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json({ limit: "100kb" }));
app.use("/api", apiLimiter);

app.get("/", (req, res) => {
  res.json({
    message: "Hostel Maintenance API is running",
  });
});

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/maintenance", maintenanceRoutes);
app.use("/api/assets", assetRoutes);

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

app.use((error, req, res, next) => {
  if (error?.message === "Origin is not allowed by CORS") {
    return res.status(403).json({ message: "Origin is not allowed" });
  }

  if (error?.type === "entity.too.large") {
    return res.status(413).json({ message: "Request body is too large" });
  }

  console.error(error);
  return res.status(500).json({ message: "Internal server error" });
});

module.exports = app;
