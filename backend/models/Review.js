const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
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
    appointment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Appointment",
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    feedback: {
        type: String,
        default: ""
    }
}, { timestamps: true });

// Ensure one review per appointment
reviewSchema.index({ appointment: 1 }, { unique: true });

module.exports = mongoose.model("Review", reviewSchema);
