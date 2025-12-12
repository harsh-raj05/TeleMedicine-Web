const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");
const {
  uploadRecord,
  getRecords,
} = require("../controllers/medicalController");

// Upload Record
router.post("/upload", auth, upload.single("record"), uploadRecord);

// Get Patient Records
router.get("/my-records", auth, getRecords);

module.exports = router;
