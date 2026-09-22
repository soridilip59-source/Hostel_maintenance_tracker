const express = require("express");

const {
  registerUser,
  loginUser,
  loginWithGoogle,
  getCurrentUser,
  updateCurrentUser,
} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/google", loginWithGoogle);
router.route("/me").get(authMiddleware, getCurrentUser).put(authMiddleware, updateCurrentUser);

module.exports = router;
