import { useEffect, useState } from "react";
import api from "../services/api";
// import DarkModeToggle from "../components/DarkModeToggle";

function PatientDashboard() {
  const [appointments, setAppointments] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchAppointments = async () => {
      const res = await api.get(`/appointments/${user.id}`, {
        headers: { Authorization: "Bearer " + token },
      });
      setAppointments(res.data.appointments);
    };
    fetchAppointments();
  }, []);

  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50"
     style={{ backgroundImage: "url('/images/telemed10.jpg')" }}>

      {/* Header */}
      <header className="backdrop-blur-3xl border-b border-white/40 shadow-sm sticky top-0 z-50">
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

            {/* Dark Mode Toggle */}
            {/* <DarkModeToggle /> */}

            <img
              src="/images/user1.png"
              className="w-10 h-10 rounded-full border border-blue-300 shadow-sm object-cover"
            />

            <button
              onClick={logout}
              className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 shadow text-white transition"
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
            className="bg-cyan-500 text-white px-5 py-3 rounded-lg shadow hover:bg-cyan-700 transition"
          >
            Book New Appointment
          </button>
          <button
            onClick={() => navigate("/upload-record")}
            className="bg-purple-600 text-white px-5 py-3 rounded-lg shadow hover:bg-purple-700"
          >
            Upload Medical Record
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
                </h3>

                <span
                  className={`px-3 py-1 rounded-full text-white text-xs tracking-wide
                    ${
                      a.status === "approved"
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
                        `http://localhost:5000/api/appointments/prescription-pdf/${a._id}?token=${token}`
                      );
                    }}
                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                  >
                    Download PDF
                  </button>
                </div>
              ) : (
                <p className="mt-3 text-gray-500 italic">
                  Prescription not added yet.
                </p>
              )}

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PatientDashboard;
