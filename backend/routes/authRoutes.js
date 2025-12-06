const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");
const User = require("../models/User");
const auth = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);

// Get all doctors
router.get("/doctors",auth, async (req, res) => {
  const doctors = await User.find({ role: "doctor" });
  res.json(doctors);
});


module.exports = router;
