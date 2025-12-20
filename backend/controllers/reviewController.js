const Review = require("../models/Review");
const Appointment = require("../models/Appointment");

// Add a new review
exports.addReview = async (req, res) => {
    try {
        const { appointmentId, rating, feedback } = req.body;
        const patientId = req.user.id;

        // Verify appointment exists and belongs to this patient
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        if (appointment.patient.toString() !== patientId) {
            return res.status(403).json({ message: "You can only review your own appointments" });
        }

        // Check if already reviewed
        const existingReview = await Review.findOne({ appointment: appointmentId });
        if (existingReview) {
            return res.status(400).json({ message: "You have already reviewed this appointment" });
        }

        const review = await Review.create({
            patient: patientId,
            doctor: appointment.doctor,
            appointment: appointmentId,
            rating,
            feedback
        });

        res.json({ message: "Review submitted successfully", review });

    } catch (err) {
        console.error("Review Error:", err);
        res.status(500).json({ message: "Error submitting review", error: err.message });
    }
};

// Get all reviews for a doctor (anonymous - no patient info)
exports.getDoctorReviews = async (req, res) => {
    try {
        const doctorId = req.params.doctorId;

        const reviews = await Review.find({ doctor: doctorId })
            .select("rating feedback createdAt")  // Exclude patient info for anonymity
            .sort({ createdAt: -1 });

        // Calculate average rating
        let avgRating = 0;
        if (reviews.length > 0) {
            const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
            avgRating = (sum / reviews.length).toFixed(1);
        }

        res.json({
            reviews,
            avgRating: parseFloat(avgRating),
            totalReviews: reviews.length
        });

    } catch (err) {
        res.status(500).json({ message: "Error fetching reviews", error: err.message });
    }
};

// Get average ratings for multiple doctors (for listing)
exports.getDoctorsRatings = async (req, res) => {
    try {
        const ratings = await Review.aggregate([
            {
                $group: {
                    _id: "$doctor",
                    avgRating: { $avg: "$rating" },
                    totalReviews: { $sum: 1 }
                }
            }
        ]);

        // Convert to object for easy lookup
        const ratingsMap = {};
        ratings.forEach(r => {
            ratingsMap[r._id.toString()] = {
                avgRating: parseFloat(r.avgRating.toFixed(1)),
                totalReviews: r.totalReviews
            };
        });

        res.json(ratingsMap);

    } catch (err) {
        res.status(500).json({ message: "Error fetching ratings", error: err.message });
    }
};

// Check if patient has reviewed an appointment
exports.checkReviewed = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const review = await Review.findOne({ appointment: appointmentId });
        res.json({ reviewed: !!review });
    } catch (err) {
        res.status(500).json({ message: "Error checking review status" });
    }
};
