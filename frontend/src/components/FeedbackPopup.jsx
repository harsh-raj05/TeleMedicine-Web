import { useEffect, useState } from "react";
import { Star, X } from "lucide-react";
import api from "../services/api";

function FeedbackPopup({ isOpen, onClose, doctorId, doctorName }) {
    const [reviews, setReviews] = useState([]);
    const [avgRating, setAvgRating] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen && doctorId) {
            fetchReviews();
        }
    }, [isOpen, doctorId]);

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/reviews/doctor/${doctorId}`);
            setReviews(res.data.reviews);
            setAvgRating(res.data.avgRating);
        } catch (err) {
            console.error("Error fetching reviews:", err);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const renderStars = (rating) => {
        return (
            <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        size={14}
                        className={star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white rounded-2xl p-6 max-w-lg w-full mx-4 shadow-2xl max-h-[80vh] overflow-hidden flex flex-col">

                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">
                            Reviews for {doctorName}
                        </h2>
                        <div className="flex items-center gap-2 mt-1">
                            {renderStars(Math.round(avgRating))}
                            <span className="text-sm text-gray-600">
                                {avgRating} ({reviews.length} reviews)
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-full transition"
                    >
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                {/* Reviews List */}
                <div className="flex-1 overflow-y-auto space-y-3">
                    {loading ? (
                        <p className="text-center text-gray-500 py-8">Loading reviews...</p>
                    ) : reviews.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">No reviews yet</p>
                    ) : (
                        reviews.map((review) => (
                            <div
                                key={review._id}
                                className="p-4 bg-gray-50 rounded-lg border border-gray-100"
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    {renderStars(review.rating)}
                                    <span className="text-xs text-gray-400">
                                        {new Date(review.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                {review.feedback && (
                                    <p className="text-gray-700 text-sm">{review.feedback}</p>
                                )}
                            </div>
                        ))
                    )}
                </div>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="mt-4 w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg font-medium transition"
                >
                    Close
                </button>

            </div>
        </div>
    );
}

export default FeedbackPopup;
