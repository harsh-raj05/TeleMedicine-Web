const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, specialization, contactNumber, degreeQualification, workingExperience } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    // Only save specialization and profile fields if role is doctor
    const userData = {
      name,
      email,
      password: hashed,
      role
    };

    if (role === "doctor") {
      if (specialization) userData.specialization = specialization;
      if (contactNumber) userData.contactNumber = contactNumber;
      if (degreeQualification) userData.degreeQualification = degreeQualification;
      if (workingExperience) userData.workingExperience = workingExperience;
    }

    const user = await User.create(userData);

    res.json({ message: "User registered", user });
  } catch (err) {
    res.status(500).json({ message: "Error registering user" });
  }
};


// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      message: "Login success",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        specialization: user.specialization || null,
        contactNumber: user.contactNumber || null,
        degreeQualification: user.degreeQualification || null,
        workingExperience: user.workingExperience || null
      }
    });

  } catch (err) {
    res.status(500).json({ message: "Login error" });
  }
};

