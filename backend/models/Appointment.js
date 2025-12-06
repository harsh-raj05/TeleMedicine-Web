const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "approved", "cancelled"],
    default: "pending"
  },

  // NEW: Prescription field
  prescription: {
    symptoms: { type: String, default: "" },
    diagnosis: { type: String, default: "" },
    medicines: { type: String, default: "" },
    instructions: { type: String, default: "" }
  }

}, { timestamps: true });

module.exports = mongoose.model("Appointment", appointmentSchema);
