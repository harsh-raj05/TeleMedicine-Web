import { useEffect, useState } from "react";
import { Star, Info, MessageCircle, Calendar, Clock, Stethoscope, User } from "lucide-react";
import api from "../services/api";
import DoctorDescriptionPopup from "../components/DoctorDescriptionPopup";

const SPECIALIZATIONS = [
  { value: "general-physician", label: "General Physician" },
  { value: "dermatologist", label: "Dermatologist" },
  { value: "cardiologist", label: "Cardiologist" },
  { value: "dentist", label: "Dentist" },
  { value: "orthopedic", label: "Orthopedic" },
  { value: "neurologist", label: "Neurologist" },
  { value: "pediatrician", label: "Pediatrician" },
  { value: "gynecologist", label: "Gynecologist" },
  { value: "psychiatrist", label: "Psychiatrist" },
  { value: "ophthalmologist", label: "Ophthalmologist" },
  { value: "ent-specialist", label: "ENT Specialist" },
  { value: "pulmonologist", label: "Pulmonologist" },
  { value: "gastroenterologist", label: "Gastroenterologist" },
];

const formatSpecialization = (spec) => {
  if (!spec) return "";
  return spec.split("-").map(word =>
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(" ");
};

function BookAppointment() {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [filterSpec, setFilterSpec] = useState("");
  const [ratings, setRatings] = useState({});
  const [form, setForm] = useState({});
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [descriptionPopup, setDescriptionPopup] = useState({ open: false, doctor: null });

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchData = async () => {
      // Fetch doctors
      const docRes = await api.get("/auth/doctors");
      setDoctors(docRes.data);
      setFilteredDoctors(docRes.data);

      // Fetch all ratings
      const ratingsRes = await api.get("/reviews/ratings");
      setRatings(ratingsRes.data);
    };
    fetchData();
  }, []);

  // Filter doctors when filter changes
  useEffect(() => {
    if (filterSpec === "") {
      setFilteredDoctors(doctors);
    } else {
      setFilteredDoctors(doctors.filter(d => d.specialization === filterSpec));
    }
    // Reset selection if filter changes
    setSelectedDoctor(null);
    setForm(prev => ({ ...prev, doctor: "" }));
  }, [filterSpec, doctors]);

  const handleDoctorSelect = (e) => {
    const doctorId = e.target.value;
    if (!doctorId) {
      setSelectedDoctor(null);
      setForm(prev => ({ ...prev, doctor: "" }));
      return;
    }
    setForm(prev => ({ ...prev, doctor: doctorId }));
    setSelectedDoctor(doctors.find(d => d._id === doctorId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await api.post("/appointments/book", {
      patient: user.id,
      doctor: form.doctor,
      date: form.date,
      time: form.time,
      reason: form.reason,
    });

    alert("Appointment booked!");
    window.location.href = "/patient-dashboard";
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    return (
      <span className="inline-flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={14}
            className={star <= fullStars ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
          />
        ))}
      </span>
    );
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-center bg-cover bg-no-repeat relative"
      style={{
        backgroundImage: "url('/images/appointment.jpg')"
      }}>

      {/* Doctor Description Popup */}
      <DoctorDescriptionPopup
        isOpen={descriptionPopup.open}
        onClose={() => setDescriptionPopup({ open: false, doctor: null })}
        doctor={descriptionPopup.doctor}
      />

      <div className="bg-white p-10 rounded-2xl shadow-xl max-w-2xl w-full">

        <h2 className="text-3xl font-bold text-center text-blue-700 mb-8">
          Book Appointment
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Filter by Specialization */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Stethoscope size={18} className="text-blue-500" /> Filter by Specialization
              </label>
              <select
                value={filterSpec}
                onChange={(e) => setFilterSpec(e.target.value)}
                className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition bg-gray-50 hover:bg-white"
              >
                <option value="">All Specializations</option>
                {SPECIALIZATIONS.map((spec) => (
                  <option key={spec.value} value={spec.value}>
                    {spec.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Select Doctor Dropdown */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <User size={18} className="text-blue-500" /> Select Doctor
              </label>
              <select
                value={form.doctor || ""}
                onChange={handleDoctorSelect}
                className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition bg-gray-50 hover:bg-white"
                disabled={filteredDoctors.length === 0}
              >
                <option value="">-- Choose a Doctor --</option>
                {filteredDoctors.map((d) => (
                  <option key={d._id} value={d._id}>
                    Dr. {d.name} {d.specialization ? `(${formatSpecialization(d.specialization)})` : ""}
                  </option>
                ))}
              </select>
              {filteredDoctors.length === 0 && filterSpec && (
                <p className="text-xs text-red-500 mt-1">No doctors found for this specialization</p>
              )}
            </div>
          </div>

          {/* Selected Doctor Info Card */}
          {selectedDoctor && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 animate-fade-in">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  {/* Profile Picture */}
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-white border-2 border-white shadow-sm flex-shrink-0">
                    {selectedDoctor.profilePicture ? (
                      <img
                        src={`${import.meta.env.VITE_API_URL || 'https://telemedicine-web.onrender.com'}${selectedDoctor.profilePicture}`}
                        alt={selectedDoctor.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">👨‍⚕️</div>
                    )}
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Dr. {selectedDoctor.name}</h3>
                    <p className="text-blue-600 text-sm font-medium">
                      {formatSpecialization(selectedDoctor.specialization)}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      {ratings[selectedDoctor._id] ? (
                        <>
                          {renderStars(ratings[selectedDoctor._id].avgRating)}
                          <span className="text-xs text-gray-500 font-medium">
                            ({ratings[selectedDoctor._id].totalReviews} reviews)
                          </span>
                        </>
                      ) : (
                        <span className="text-xs text-gray-400 italic">No reviews yet</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setDescriptionPopup({ open: true, doctor: selectedDoctor })}
                    className="bg-white p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition shadow-sm border border-gray-200 cursor-pointer"
                    title="View Profile"
                  >
                    <Info size={20} />
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Calendar size={18} className="text-blue-500" /> Date
              </label>
              <input
                type="date"
                name="date"
                required
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Clock size={18} className="text-blue-500" /> Time
              </label>
              <input
                type="time"
                name="time"
                required
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Reason for Appointment</label>
            <textarea
              name="reason"
              required
              placeholder="Briefly describe your symptoms or reason for visit..."
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
              className="w-full border border-gray-300 p-3 rounded-xl h-28 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={!form.doctor}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:translate-y-[-2px] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none cursor-pointer"
          >
            Confirm Appointment
          </button>
        </form>

      </div>
    </div>
  );
}

export default BookAppointment;


