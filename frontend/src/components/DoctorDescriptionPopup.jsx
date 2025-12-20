import { useEffect, useState } from "react";
import { Star, X, Phone, GraduationCap, Briefcase, MessageSquare } from "lucide-react";
import api from "../services/api";

function DoctorDescriptionPopup({ isOpen, onClose, doctor }) {
    const [reviews, setReviews] = useState([]);
    const [avgRating, setAvgRating] = useState(0);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("contact");

    useEffect(() => {
        if (isOpen && doctor?._id) {
            fetchReviews();
        }
    }, [isOpen, doctor?._id]);

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/reviews/doctor/${doctor._id}`);
            setReviews(res.data.reviews);
            setAvgRating(res.data.avgRating);
        } catch (err) {
            console.error("Error fetching reviews:", err);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !doctor) return null;

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

    const tabs = [
        { id: "contact", label: "Contact", icon: Phone },
        { id: "qualifications", label: "Qualifications", icon: GraduationCap },
        { id: "feedback", label: "Feedback", icon: MessageSquare }
    ];

    const getProfilePictureUrl = () => {
        if (doctor?.profilePicture) {
            return `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${doctor.profilePicture}`;
        }
        return null;
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white rounded-2xl p-6 max-w-lg w-full mx-4 shadow-2xl max-h-[85vh] overflow-hidden flex flex-col">

                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        {/* Profile Picture */}
                        <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-200 border-2 border-blue-100 flex-shrink-0">
                            {getProfilePictureUrl() ? (
                                <img
                                    src={getProfilePictureUrl()}
                                    alt="Dr."
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-2xl">
                                    👨‍⚕️
                                </div>
                            )}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">
                                Dr. {doctor.name}
                            </h2>
                            {doctor.specialization && (
                                <span className="text-sm text-purple-600 font-medium">
                                    {doctor.specialization.split("-").map(word =>
                                        word.charAt(0).toUpperCase() + word.slice(1)
                                    ).join(" ")}
                                </span>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-full transition"
                    >
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                {/* Tab Navigation */}
                <div className="flex border-b border-gray-200 mb-4">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${activeTab === tab.id
                                    ? "border-blue-500 text-blue-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                <Icon size={16} />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Tab Content */}
                <div className="flex-1 overflow-y-auto">

                    {/* Contact Section */}
                    {activeTab === "contact" && (
                        <div className="space-y-4">
                            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <Phone size={20} className="text-blue-600" />
                                    </div>
                                    <h3 className="font-semibold text-gray-800">Contact Information</h3>
                                </div>
                                {doctor.contactNumber ? (
                                    <div className="ml-11">
                                        <p className="text-gray-600 text-sm">Phone Number</p>
                                        <p className="text-lg font-medium text-gray-800">{doctor.contactNumber}</p>
                                    </div>
                                ) : (
                                    <p className="ml-11 text-gray-500 italic">Contact information not provided</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Qualifications Section */}
                    {activeTab === "qualifications" && (
                        <div className="space-y-4">
                            {/* Degree */}
                            <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="p-2 bg-purple-100 rounded-lg">
                                        <GraduationCap size={20} className="text-purple-600" />
                                    </div>
                                    <h3 className="font-semibold text-gray-800">Degree & Qualification</h3>
                                </div>
                                {doctor.degreeQualification ? (
                                    <p className="ml-11 text-lg font-medium text-gray-800">{doctor.degreeQualification}</p>
                                ) : (
                                    <p className="ml-11 text-gray-500 italic">Qualification not provided</p>
                                )}
                            </div>

                            {/* Experience */}
                            <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <Briefcase size={20} className="text-green-600" />
                                    </div>
                                    <h3 className="font-semibold text-gray-800">Working Experience</h3>
                                </div>
                                {doctor.workingExperience ? (
                                    <p className="ml-11 text-lg font-medium text-gray-800">{doctor.workingExperience}</p>
                                ) : (
                                    <p className="ml-11 text-gray-500 italic">Experience not provided</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Feedback Section */}
                    {activeTab === "feedback" && (
                        <div className="space-y-4">
                            {/* Rating Summary */}
                            <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-100">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2">
                                        {renderStars(Math.round(avgRating))}
                                        <span className="text-lg font-bold text-gray-800">{avgRating}</span>
                                    </div>
                                    <span className="text-sm text-gray-600">
                                        ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
                                    </span>
                                </div>
                            </div>

                            {/* Reviews List */}
                            <div className="space-y-3">
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
                        </div>
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

export default DoctorDescriptionPopup;
