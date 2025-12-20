import { useState } from "react";
import { Star } from "lucide-react";
import api from "../services/api";

function RatingModal({ isOpen, onClose, appointment, onSuccess }) {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [feedback, setFeedback] = useState("");
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async () => {
        if (rating === 0) {
            alert("Please select a rating");
            return;
        }

        setLoading(true);
        try {
            await api.post("/reviews", {
                appointmentId: appointment._id,
                rating,
                feedback
            });
            alert("Review submitted successfully!");
            onSuccess();
            onClose();
        } catch (err) {
            alert(err.response?.data?.message || "Error submitting review");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">

                <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
                    Rate Doctor
                </h2>
                <p className="text-center text-gray-500 mb-6">
                    {appointment.doctor.name}
                </p>

                {/* Star Rating */}
                <div className="flex justify-center gap-2 mb-6">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="transition-transform hover:scale-110"
                        >
                            <Star
                                size={36}
                                className={`${star <= (hoverRating || rating)
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-gray-300"
                                    } transition-colors`}
                            />
                        </button>
                    ))}
                </div>

                <p className="text-center text-sm text-gray-500 mb-4">
                    {rating > 0 ? `You selected ${rating} star${rating > 1 ? "s" : ""}` : "Click to rate"}
                </p>

                {/* Feedback */}
                <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Share your experience (optional)..."
                    className="w-full border p-3 rounded-lg h-28 focus:ring-2 focus:ring-blue-500 outline-none resize-none mb-6"
                />

                {/* Buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg font-medium transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition disabled:opacity-50"
                    >
                        {loading ? "Submitting..." : "Submit Review"}
                    </button>
                </div>

            </div>
        </div>
    );
}

export default RatingModal;
