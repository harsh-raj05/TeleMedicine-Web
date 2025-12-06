import { useEffect, useState } from "react";
import api from "../services/api";
// import Sidebar from "../components/Sidebar";


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
    <div className="min-h-screen bg-gray-100">

      {/* <Sidebar userRole="patient" /> */}
      {/* Header */}
      <header className="bg-[url('/images/telemed7.jpg')] bg-cover bg-center bg-no-repeat text-black p-6 shadow-md flex justify-between items-center">
        <h1 className="text-2xl font-semibold">
          Welcome, {user.name}
        </h1>
        <button
          onClick={logout}
          className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 shadow"
        >
          Logout
        </button>
      </header>

      <div className="max-w-5xl mx-auto p-6">

        {/* Book Appointment */}
        <div className="flex justify-end mb-6">
          <button
            onClick={() => (window.location.href = "/book-appointment")}
            className="bg-blue-600 text-white px-5 py-3 rounded-lg shadow hover:bg-blue-700"
          >
            Book New Appointment
          </button>
        </div>

        <h2 className="text-xl font-bold mb-4 text-blue-700">Your Appointments</h2>

        {appointments.length === 0 && (
          <p className="text-gray-600">No appointments yet.</p>
        )}

        <div className="space-y-6">
          {appointments.map((a) => (
            <div key={a._id} className="bg-white p-6 rounded-xl shadow-md border border-gray-200">

              {/* Appointment Basic Info */}
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">
                  Doctor: {a.doctor.name}
                </h3>

                <span
                  className={`px-3 py-1 rounded-full text-white text-sm 
                    ${
                      a.status === "approved"
                        ? "bg-green-600"
                        : a.status === "cancelled"
                        ? "bg-red-600"
                        : "bg-yellow-500"
                    }
                  `}
                >
                  {a.status}
                </span>
              </div>

              <div className="mt-3 text-gray-700">
                <p><strong>Date:</strong> {a.date}</p>
                <p><strong>Time:</strong> {a.time}</p>
                <p className="col-span-2"><strong>Reason:</strong> {a.reason}</p>
              </div>

              {/* Prescription Section */}
              {a.prescription?.medicines ? (
                <div className="mt-5 bg-blue-50 border border-blue-200 p-5 rounded-lg">
                  <h4 className="font-semibold text-blue-700 mb-2">
                    Prescription
                  </h4>

                  <p><strong>Symptoms:</strong> {a.prescription.symptoms}</p>
                  <p><strong>Diagnosis:</strong> {a.prescription.diagnosis}</p>
                  <p><strong>Medicines:</strong> {a.prescription.medicines}</p>
                  <p><strong>Instructions:</strong> {a.prescription.instructions}</p>

                  <button
                      onClick={() => {
                        const token = localStorage.getItem("token");
                        window.open(
                          `http://localhost:5000/api/appointments/prescription-pdf/${a._id}?token=${token}`
                        );
                      }}
                      className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      Download PDF
                  </button>


                </div>
              ) : (
                <p className="mt-3 text-gray-500">Prescription not added yet.</p>
              )}

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PatientDashboard;
