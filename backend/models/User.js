const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["patient", "doctor", "admin", "healthworker"],
    default: "patient"
  },
  specialization: {
    type: String,
    enum: [
      "general-physician",
      "dermatologist",
      "cardiologist",
      "dentist",
      "orthopedic",
      "neurologist",
      "pediatrician",
      "gynecologist",
      "psychiatrist",
      "ophthalmologist",
      "ent-specialist",
      "pulmonologist",
      "gastroenterologist"
    ],
    default: null
  },
  // Doctor-specific profile fields
  contactNumber: {
    type: String,
    default: null
  },
  degreeQualification: {
    type: String,
    default: null
  },
  workingExperience: {
    type: String,
    default: null
  },
  profilePicture: {
    type: String,
    default: null
  }
});

module.exports = mongoose.model("User", userSchema);
