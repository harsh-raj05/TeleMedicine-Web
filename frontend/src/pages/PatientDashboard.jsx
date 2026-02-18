import { useEffect, useState, useRef } from "react";
import { Star, MessageSquare } from "lucide-react";
import io from "socket.io-client";
import api from "../services/api";
import RatingModal from "../components/RatingModal";
import ChatBox from "../components/ChatBox";

const SOCKET_URL = import.meta.env.VITE_API_URL || "https://telemedicine-web.onrender.com";

function PatientDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [reviewedAppointments, setReviewedAppointments] = useState({});
  const [ratingModal, setRatingModal] = useState({ open: false, appointment: null });
  const [chatDoctor, setChatDoctor] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({});
  const socketRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const fetchAppointments = async () => {
    const res = await api.get(`/appointments/${user.id}`);
    setAppointments(res.data.appointments);

    // Check which appointments have been reviewed
    const reviewed = {};
    for (const apt of res.data.appointments) {
      if (apt.status === "approved") {
        try {
          const checkRes = await api.get(`/reviews/check/${apt._id}`);
          reviewed[apt._id] = checkRes.data.reviewed;
        } catch {
          reviewed[apt._id] = false;
        }
      }
    }
    setReviewedAppointments(reviewed);
  };

  const fetchUnreadCounts = async () => {
    try {
      const res = await api.get(`/chat/unread/${user.id}`);
      setUnreadCounts(res.data);
    } catch (err) {
      console.error("Error fetching unread counts", err);
    }
  };

  useEffect(() => {
    fetchAppointments();
    fetchUnreadCounts();

    // Initialize Socket
    socketRef.current = io(SOCKET_URL);
    socketRef.current.emit("join_room", user.id);

    // Listen for incoming messages
    socketRef.current.on("receive_message", (data) => {
      // If the chat with this sender is NOT open, increment unread count
      if (chatDoctor?._id !== data.sender) {
        setUnreadCounts((prev) => ({
          ...prev,
          [data.sender]: (prev[data.sender] || 0) + 1,
        }));
      }
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [chatDoctor]); // Re-run listener logic if chatDoctor changes (to update closure)

  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const handleRatingSuccess = () => {
    fetchAppointments();
  };

  const openChat = async (doctor) => {
    setChatDoctor(doctor);
    // Optimistically clear unread count locally
    setUnreadCounts((prev) => ({ ...prev, [doctor._id]: 0 }));
    // Mark as read in backend
    try {
      await api.put("/chat/read", { senderId: doctor._id, receiverId: user.id });
    } catch (err) {
      console.error("Error marking messages as read", err);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50"
      style={{ backgroundImage: "url('/images/telemed10.jpg')" }}>

      {/* Chat Box */}
      {chatDoctor && (
        <ChatBox
          currentUser={user}
          receiver={chatDoctor}
          onClose={() => setChatDoctor(null)}
        />
      )}

      {/* Rating Modal */}
      <RatingModal
        isOpen={ratingModal.open}
        onClose={() => setRatingModal({ open: false, appointment: null })}
        appointment={ratingModal.appointment}
        onSuccess={handleRatingSuccess}
      />

      {/* Header */}
      <header className=" backdrop-blur-3xl border-b border-white/40 shadow-sm sticky top-0 z-50">

        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">

          {/* Left */}
          <div>
            <h1 className="text-xl font-bold text-emerald-600 tracking-wide">
              Hello, {user.name} 👋
            </h1>
            <p className="text-gray-600 text-sm -mt-1">
              Welcome to your health dashboard
            </p>
          </div>

          {/* Right */}
          <div className="flex items-center gap-4">

            <img
              src="/images/user1.png"
              className="w-10 h-10 rounded-full border border-blue-300 shadow-sm object-cover"
            />

            <button
              onClick={logout}
              className="bg-red-500 cursor-pointer px-4 py-2 rounded-lg hover:bg-red-600 shadow text-white transition"
            >
              Logout
            </button>
          </div>

        </div>
      </header>


      <div className="max-w-5xl mx-auto p-6">

        {/* Book Appointment */}
        <div className="flex justify-end mb-6">
          <button
            onClick={() => (window.location.href = "/book-appointment")}
            className="cursor-pointer bg-cyan-500 text-white px-5 py-3 rounded-lg shadow hover:bg-cyan-700 transition"
          >
            Book New Appointment
          </button>
        </div>

        <h2 className="text-2xl font-bold mb-4 text-blue-600">
          Your Appointments
        </h2>

        {appointments.length === 0 && (
          <p className="text-gray-600 italic">No appointments yet.</p>
        )}

        {/* Appointment Cards */}
        <div className="grid gap-7">
          {appointments.map((a) => (
            <div key={a._id}
              className="bg-blue-100 p-6 rounded-xl shadow-md border border-gray-100 hover:border-blue-200 transition">

              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">
                  👨‍⚕️ {a.doctor.name}
                  {a.doctor.specialization && (
                    <span className="ml-2 px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full">
                      {a.doctor.specialization.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                    </span>
                  )}
                </h3>

                <span
                  className={`px-3 py-1 rounded-full text-white text-xs tracking-wide
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

              <div className="mt-3 text-gray-700 space-y-1">
                <p>Date: <span className="font-semibold">{a.date}</span></p>
                <p>Time: <span className="font-semibold">{a.time}</span></p>
                <p>Reason: <span className="font-semibold">{a.reason}</span></p>
              </div>

              {/* Prescription */}
              {a.prescription?.medicines ? (
                <div className="mt-5 bg-blue-50 border border-blue-200 p-5 rounded-lg shadow-inner">
                  <h4 className="font-bold text-blue-700 mb-3">Prescription</h4>

                  <div className="space-y-1 text-gray-700">
                    <p><strong>Symptoms:</strong> {a.prescription.symptoms}</p>
                    <p><strong>Diagnosis:</strong> {a.prescription.diagnosis}</p>
                    <p><strong>Medicines:</strong> {a.prescription.medicines}</p>
                    <p><strong>Instructions:</strong> {a.prescription.instructions}</p>
                  </div>

                  <button
                    onClick={() => {
                      const token = localStorage.getItem("token");
                      window.open(
                        `https://telemedicine-web.onrender.com/api/appointments/prescription-pdf/${a._id}?token=${token}`
                      );
                    }}
                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition cursor-pointer"
                  >
                    Download PDF
                  </button>
                </div>
              ) : (
                <p className="mt-3 text-gray-500 italic">
                  Prescription not added yet.
                </p>
              )}

              {/* Actions for Approved Appointments */}
              {a.status === "approved" && (
                <div className="mt-4 flex flex-wrap gap-3 items-center">

                  {/* Chat Button */}
                  <button
                    onClick={() => openChat(a.doctor)}
                    className="relative cursor-pointer inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition shadow-sm"
                  >
                    <MessageSquare size={18} />
                    Chat with Doctor
                    {unreadCounts[a.doctor._id] > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-md border-2 border-white">
                        {unreadCounts[a.doctor._id]}
                      </span>
                    )}
                  </button>

                  {/* Rate Doctor Button */}
                  {reviewedAppointments[a._id] ? (
                    <span className="inline-flex items-center gap-1 text-green-600 text-sm font-medium bg-green-50 px-3 py-2 rounded-lg">
                      <Star size={16} className="fill-green-600" />
                      Rated
                    </span>
                  ) : (
                    <button
                      onClick={() => setRatingModal({ open: true, appointment: a })}
                      className="cursor-pointer inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition shadow-sm"
                    >
                      <Star size={18} />
                      Rate Doctor
                    </button>
                  )}
                </div>
              )}

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PatientDashboard;

