const jwt = require("jsonwebtoken");
const Appointment = require("../models/Appointment");
const PDFDocument = require("pdfkit");

exports.bookAppointment = async (req, res) => {
  try {
    const { patient, doctor, date, time, reason } = req.body;

    const appointment = await Appointment.create({
      patient,
      doctor,
      date,
      time,
      reason
    });

    res.json({
      message: "Appointment booked",
      appointment
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAppointmentsByUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const appointments = await Appointment.find({
      $or: [{ patient: userId }, { doctor: userId }]
    }).populate("patient doctor", "name email role");

    res.json({ appointments });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const updated = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json({
      message: "Status updated",
      updated
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ADD PRESCRIPTION TO APPOINTMENT
exports.addPrescription = async (req, res) => {
  try {
    const appointmentId = req.params.id;

    const updated = await Appointment.findByIdAndUpdate(
      appointmentId,
      {
        prescription: {
          symptoms: req.body.symptoms,
          diagnosis: req.body.diagnosis,
          medicines: req.body.medicines,
          instructions: req.body.instructions
        }
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json({
      message: "Prescription saved successfully",
      appointment: updated
    });

  } catch (err) {
    console.error("Prescription Error:", err);
    res.status(500).json({ error: err.message });
  }
};


// Generate Prescription PDF
exports.generatePrescriptionPDF = async (req, res) => {
  try {
    const token = req.query.token;

    if (!token) {
      return res.status(401).json({ message: "Token missing in URL" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const appointment = await Appointment.findById(req.params.id)
      .populate("patient doctor");

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Create PDF
    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=prescription.pdf");

    doc.pipe(res);

    doc.fontSize(20).text("TeleHealth Prescription", { underline: true });
    doc.moveDown();

    doc.fontSize(14).text(`Doctor: ${appointment.doctor.name}`);
    doc.text(`Patient: ${appointment.patient.name}`);
    doc.text(`Date: ${appointment.date}`);
    doc.text(`Time: ${appointment.time}`);
    doc.moveDown();

    doc.text("Symptoms:", { bold: true });
    doc.text(appointment.prescription.symptoms || "Not provided");
    doc.moveDown();

    doc.text("Diagnosis:");
    doc.text(appointment.prescription.diagnosis || "Not provided");
    doc.moveDown();

    doc.text("Medicines:");
    doc.text(appointment.prescription.medicines || "Not provided");
    doc.moveDown();

    doc.text("Instructions:");
    doc.text(appointment.prescription.instructions || "Not provided");

    doc.end();

  } catch (err) {
    res.status(500).json({ message: "Error generating PDF", error: err.message });
  }
};

// GET PATIENT HISTORY (All approved past appointments)
exports.getPatientHistory = async (req, res) => {
  try {
    const { patientId } = req.params;

    const history = await Appointment.find({
      patient: patientId,
      status: "approved"
    })
      .populate("doctor", "name specialization")
      .sort({ date: -1, time: -1 });

    res.json({ history });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};