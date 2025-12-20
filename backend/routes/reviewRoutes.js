const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const {
    addReview,
    getDoctorReviews,
    getDoctorsRatings,
    checkReviewed
} = require("../controllers/reviewController");

// Public - get reviews for a doctor
router.get("/doctor/:doctorId", getDoctorReviews);

// Public - get ratings for all doctors (for listing)
router.get("/ratings", getDoctorsRatings);

// Protected routes
router.use(auth);

// Submit a review
router.post("/", addReview);

// Check if appointment is reviewed
router.get("/check/:appointmentId", checkReviewed);

module.exports = router;
