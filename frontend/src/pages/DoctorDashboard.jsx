import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Sidebar from "../components/Sidebar";


function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();

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

  const updateStatus = async (id, status) => {
    await api.put(
      `/appointments/status/${id}`,
      { status },
      { headers: { Authorization: "Bearer " + token } }
    );
    window.location.reload();
  };

  return (
    <div className="flex min-h-screen bg-gray-100">

      <Sidebar userRole="doctor" />

      {/* Header */}
      <header
        className="bg-[url('/images/telemed8.jpg')] bg-cover bg-center bg-no-repeat 
                  text-white p-7 shadow-lg flex justify-between items-center"
        >
        <h1 className="text-2xl font-bold text-black">
          Doctor Dashboard – {user.name}
        </h1>
      </header>

      <div className="max-w-5xl mx-auto p-6">
        <h2 className="text-2xl font-semibold text-blue-700 mb-6">
          Patient Appointments
        </h2>

        <div className="space-y-6">
          {appointments.map((a) => (
            <div key={a._id} className="bg-white p-6 rounded-xl shadow-md border border-gray-200">

              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{a.patient.name}</h3>

                <span
                  className={`px-3 py-1 rounded-full text-sm text-white
                    ${
                      a.status === "approved"
                        ? "bg-green-600"
                        : a.status === "cancelled"
                        ? "bg-red-600"
                        : "bg-yellow-500"
                    }`}
                >
                  {a.status}
                </span>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-4 text-gray-700">
                <p><strong>Date:</strong> {a.date}</p>
                <p><strong>Time:</strong> {a.time}</p>
                <p className="col-span-2"><strong>Reason:</strong> {a.reason}</p>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex gap-4 mt-5">
                {a.status === "pending" && (
                  <button
                    onClick={() => updateStatus(a._id, "approved")}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  >
                    Approve
                  </button>
                )}

                {a.status !== "cancelled" && (
                  <button
                    onClick={() => updateStatus(a._id, "cancelled")}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                  >
                    Cancel
                  </button>
                )}

                {a.status === "approved" && (
                  <button
                    onClick={() => navigate(`/write-prescription/${a._id}`)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Write Prescription
                  </button>
                )}
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DoctorDashboard;
