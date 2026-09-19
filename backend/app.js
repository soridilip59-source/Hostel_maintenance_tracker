const express = require("express");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hostel Maintenance API is running");
});

module.exports = app;