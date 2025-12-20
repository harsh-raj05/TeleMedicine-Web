import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Star, MessageSquare, User, Edit, LogOut, ChevronDown, History } from "lucide-react";
import io from "socket.io-client";
import api from "../services/api";
import EditProfileModal from "../components/EditProfileModal";
import ChatBox from "../components/ChatBox";
import PatientHistoryModal from "../components/PatientHistoryModal";

const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [showReviews, setShowReviews] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [chatPatient, setChatPatient] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedPatientHistory, setSelectedPatientHistory] = useState([]);
  const [historyPatient, setHistoryPatient] = useState(null);
  const dropdownRef = useRef(null);
  const socketRef = useRef(null);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const fetchUnreadCounts = async () => {
    try {
      const res = await api.get(`/chat/unread/${user.id}`);
      setUnreadCounts(res.data);
    } catch (err) {
      console.error("Error fetching unread counts", err);
    }
  };

  useEffect(() => {
    setCurrentUser(user);
    fetchUnreadCounts();

    const fetchData = async () => {
      // Fetch appointments
      const aptRes = await api.get(`/appointments/${user.id}`);
      setAppointments(aptRes.data.appointments);

      // Fetch reviews for this doctor
      const reviewRes = await api.get(`/reviews/doctor/${user.id}`);
      setReviews(reviewRes.data.reviews);
      setAvgRating(reviewRes.data.avgRating);
    };
    fetchData();

    // Initialize Socket
    socketRef.current = io(SOCKET_URL);
    socketRef.current.emit("join_room", user.id);

    // Listen for incoming messages
    socketRef.current.on("receive_message", (data) => {
      // If the chat with this sender is NOT open, increment unread count
      if (chatPatient?._id !== data.sender) {
        setUnreadCounts((prev) => ({
          ...prev,
          [data.sender]: (prev[data.sender] || 0) + 1,
        }));
      }
    });

    // Close dropdown when clicking outside
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      socketRef.current.disconnect();
    };
  }, [chatPatient]); // Re-run listener logic if chatPatient changes

  const updateStatus = async (id, status) => {
    await api.put(`/appointments/status/${id}`, { status });
    window.location.reload();
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const handleProfileUpdate = (updatedUser) => {
    setCurrentUser(updatedUser);
  };

  const handleViewHistory = async (patient) => {
    console.log("Fetching history for patient:", patient);
    try {
      if (!patient?._id) {
        console.error("Patient ID is missing!");
        alert("Patient ID is error");
        return;
      }
      const res = await api.get(`/appointments/patient-history/${patient._id}`);
      console.log("History response:", res.data);
      setSelectedPatientHistory(res.data.history);
      setHistoryPatient(patient);
      setShowHistoryModal(true);
    } catch (err) {
      console.error("Error fetching history", err);
      console.error("Error response:", err.response);
      alert("Failed to fetch patient history: " + (err.response?.data?.error || err.message));
    }
  };

  const getProfilePictureUrl = () => {
    if (currentUser?.profilePicture) {
      return `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${currentUser.profilePicture}`;
    }
    return null;
  };

  const renderStars = (rating) => {
    return (
      <span className="inline-flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
          />
        ))}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Chat Box */}
      {chatPatient && (
        <ChatBox
          currentUser={currentUser}
          receiver={chatPatient}
          onClose={() => setChatPatient(null)}
        />
      )}

      {/* Patient History Modal */}
      <PatientHistoryModal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        history={selectedPatientHistory}
        patient={historyPatient}
      />

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        user={currentUser}
        onProfileUpdate={handleProfileUpdate}
      />

      {/* HEADER */}
      <header
        className="relative bg-cover bg-center text-white py-8 px-10 shadow-lg"
        style={{ backgroundImage: "url('/images/doctorDash.png')" }}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-none"></div>

        <div className="relative z-10 flex justify-between items-center">
          <div className="flex items-center gap-4">
            {/* Profile Picture */}
            <div className="w-16 h-16 rounded-full overflow-hidden bg-white/20 border-2 border-white/50">
              {getProfilePictureUrl() ? (
                <img
                  src={getProfilePictureUrl()}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User size={28} className="text-white/70" />
                </div>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold">
                Dr. {user.name}
              </h1>
              {user.specialization && (
                <span className="inline-block mt-1 px-3 py-1 text-sm bg-white/20 backdrop-blur-sm text-white rounded-full">
                  {user.specialization.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                </span>
              )}
              {/* Rating Badge */}
              {avgRating > 0 && (
                <div className="flex items-center gap-2 mt-2">
                  {renderStars(Math.round(avgRating))}
                  <span className="text-sm text-white/80">
                    {avgRating} ({reviews.length} reviews)
                  </span>
                </div>
              )}
              <p className="text-blue-100 mt-1">
                Manage patient appointments efficiently
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-center">
            <button
              onClick={() => setShowReviews(!showReviews)}
              className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg shadow text-white transition flex items-center gap-2"
            >
              <MessageSquare size={18} />
              {showReviews ? "Hide" : "View"} Feedback
            </button>

            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg shadow text-white transition flex items-center gap-2 backdrop-blur-sm"
              >
                <User size={18} />
                Profile
                <ChevronDown size={16} className={`transition-transform ${showProfileDropdown ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-20">
                  <button
                    onClick={() => {
                      setShowEditModal(true);
                      setShowProfileDropdown(false);
                    }}
                    className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <Edit size={16} className="text-blue-600" />
                    Edit Profile
                  </button>
                  <hr className="my-1" />
                  <button
                    onClick={logout}
                    className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>


      {/* BODY */}
      <div className="max-w-6xl mx-auto px-8 py-10">

        {/* Anonymous Reviews Section */}
        {showReviews && (
          <div className="mb-8 bg-white rounded-xl p-6 shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <MessageSquare size={20} className="text-purple-600" />
              Patient Feedback (Anonymous)
            </h2>

            {reviews.length === 0 ? (
              <p className="text-gray-500 italic">No feedback received yet.</p>
            ) : (
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {reviews.map((review) => (
                  <div
                    key={review._id}
                    className="p-4 bg-gray-50 rounded-lg border border-gray-100"
                  >
                    <div className="flex items-center justify-between mb-2">
                      {renderStars(review.rating)}
                      <span className="text-xs text-gray-400">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {review.feedback ? (
                      <p className="text-gray-700">{review.feedback}</p>
                    ) : (
                      <p className="text-gray-400 italic text-sm">No written feedback</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <h2 className="text-2xl font-semibold text-gray-800 mb-8">
          Patient Appointments
        </h2>

        <div className="space-y-6">
          {appointments.map((a) => (
            <div
              key={a._id}
              className="relative p-7 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all bg-cover bg-center"
              style={{ backgroundImage: "url('/images/teleMedCard.png')" }}
            >
              {/* Card overlay */}
              <div className="absolute inset-0 bg-white/75 backdrop-blur-xs rounded-xl"></div>

              <div className="relative z-10">
                {/* Row */}
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {a.patient.name}
                  </h3>

                  <span
                    className={`px-4 py-1 rounded-full font-medium text-white text-sm
                    ${a.status === "approved"
                        ? "bg-green-600"
                        : a.status === "cancelled"
                          ? "bg-red-600"
                          : "bg-yellow-500"
                      }
                  `}
                  >
                    {a.status.toUpperCase()}
                  </span>
                </div>

                {/* Info */}
                <div className="mt-4 text-gray-700 space-y-1 text-[15px]">
                  <p>Date: {a.date}</p>
                  <p>Time: {a.time}</p>
                  <p>Reason: {a.reason}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-6 text-sm flex-wrap">
                  {a.status === "approved" && (
                    <>
                      <button
                        onClick={async () => {
                          setChatPatient(a.patient);
                          // Optimistically clear unread count locally
                          setUnreadCounts((prev) => ({ ...prev, [a.patient._id]: 0 }));
                          // Mark as read in backend
                          try {
                            await api.put("/chat/read", { senderId: a.patient._id, receiverId: user.id });
                          } catch (err) {
                            console.error("Error marking messages as read", err);
                          }
                        }}
                        className="relative px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 cursor-pointer flex items-center gap-2"
                      >
                        <MessageSquare size={16} /> Chat
                        {unreadCounts[a.patient._id] > 0 && (
                          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-md border-2 border-white">
                            {unreadCounts[a.patient._id]}
                          </span>
                        )}
                      </button>

                      <button
                        onClick={() => handleViewHistory(a.patient)}
                        className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer flex items-center gap-2"
                        title="View Medical History"
                      >
                        <History size={16} /> History
                      </button>
                    </>
                  )}

                  {a.status === "pending" && (
                    <button
                      onClick={() => updateStatus(a._id, "approved")}
                      className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
                    >
                      Approve
                    </button>
                  )}

                  {a.status !== "cancelled" && (
                    <button
                      onClick={() => updateStatus(a._id, "cancelled")}
                      className="px-4 py-2 rounded bg-amber-600 text-white hover:bg-amber-700 cursor-pointer"
                    >
                      Cancel
                    </button>
                  )}

                  {a.status === "approved" && (
                    <button
                      onClick={() => navigate(`/write-prescription/${a._id}`)}
                      className="px-4 py-2 rounded bg-pink-600 text-white hover:bg-pink-700 cursor-pointer"
                    >
                      Write Prescription
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DoctorDashboard;
