const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.log("MongoDB connection failed:", error.message);
        console.log("Retrying MongoDB connection in 5 seconds...");
        setTimeout(connectDB, 5000);
    }
};

module.exports = connectDB;