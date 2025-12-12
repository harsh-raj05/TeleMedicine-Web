const MedicalRecord = require("../models/MedicalRecord");

// Upload medical record
exports.uploadRecord = async (req, res) => {
  try {
    const record = await MedicalRecord.create({
      patient: req.user.id,
      fileName: req.file.filename,
      filePath: req.file.path,
    });

    res.json({ message: "File uploaded successfully", record });
  } catch (err) {
    res.status(500).json({ message: "Upload failed", error: err });
  }
};

// Get all records for a patient
exports.getRecords = async (req, res) => {
  try {
    const records = await MedicalRecord.find({ patient: req.user.id });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch records", error: err });
  }
};
