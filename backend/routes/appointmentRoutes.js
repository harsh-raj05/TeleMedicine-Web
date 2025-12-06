const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const {
  bookAppointment,
  getAppointmentsByUser,
  updateStatus,
  addPrescription,
  generatePrescriptionPDF
} = require("../controllers/appointmentController");

//PDF
router.get("/prescription-pdf/:id", generatePrescriptionPDF);

// Protect ALL appointment routes
router.use(auth);

// Book appointment
router.post("/book", bookAppointment);

// Get all appointments for user (patient or doctor)
router.get("/:id", getAppointmentsByUser);

// Update status
router.put("/status/:id", updateStatus);

// Add prescription
router.put("/prescription/:id", addPrescription);


module.exports = router;
