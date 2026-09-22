const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");

const googleClientId = process.env.GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID;
const googleClient = new OAuth2Client(googleClientId);

function createToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
}

function userResponse(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    profileImage: user.profileImage || ""
  };
}

// Register
const registerUser = async (req, res) => {
  try {
    const name = req.body.name?.trim();
    const email = req.body.email?.trim().toLowerCase();
    const { password } = req.body;

    if (!name || !email || typeof password !== "string" || !password) {
      return res.status(400).json({
        message: "Name, email and password are required"
      });
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ message: "Please enter a valid email address" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must contain at least 6 characters" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "student"
    });

    res.status(201).json({
      message: "User registered successfully",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Registration failed",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};

// Login
const loginUser = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const { password } = req.body;

    if (!email || typeof password !== "string" || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const isPasswordCorrect = user.password && await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const token = createToken(user);

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        ...userResponse(user)
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Login failed",
      error: error.message
    });
  }
};

const loginWithGoogle = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!googleClientId) {
      return res.status(503).json({ message: "Google login is not configured on the server" });
    }

    if (!credential) {
      return res.status(400).json({ message: "Google credential is required" });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: googleClientId
    });
    const payload = ticket.getPayload();

    if (!payload?.email || !payload.email_verified) {
      return res.status(401).json({ message: "Google account email could not be verified" });
    }

    let user = await User.findOne({ email: payload.email.toLowerCase() }).select("+password");

    if (!user) {
      user = await User.create({
        name: payload.name || payload.email.split("@")[0],
        email: payload.email.toLowerCase(),
        role: "student",
        profileImage: payload.picture || ""
      });
    } else if (!user.profileImage && payload.picture) {
      user.profileImage = payload.picture;
      await user.save();
    }

    return res.status(200).json({
      message: "Google login successful",
      token: createToken(user),
      user: userResponse(user)
    });
  } catch (error) {
    return res.status(401).json({ message: "Google login failed" });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json({ data: userResponse(user) });
  } catch (error) {
    return res.status(500).json({ message: "Unable to load profile" });
  }
};

const updateCurrentUser = async (req, res) => {
  try {
    const name = req.body.name?.trim();
    const email = req.body.email?.trim().toLowerCase();
    if (!name || !email || !/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ message: "A valid name and email are required" });
    const existing = await User.findOne({ email, _id: { $ne: req.user.id } });
    if (existing) return res.status(400).json({ message: "That email address is already in use" });
    const user = await User.findByIdAndUpdate(req.user.id, { name, email }, { new: true, runValidators: true });
    return res.json({ message: "Profile updated successfully", data: userResponse(user) });
  } catch (error) {
    return res.status(500).json({ message: "Unable to update profile" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  loginWithGoogle,
  getCurrentUser,
  updateCurrentUser,
};
