const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const MedicalRecord = require("../models/MedicalRecord");

// Upload new record
router.post("/upload", auth, async (req, res) => {
  const { patient, title, description, fileUrl } = req.body;

  const record = await MedicalRecord.create({
    patient,
    title,
    description,
    fileUrl
  });

  res.json({ message: "Record uploaded", record });
});

// Get all records for a patient
router.get("/:patientId", auth, async (req, res) => {
  const records = await MedicalRecord.find({ patient: req.params.patientId });
  res.json(records);
});

module.exports = router;
