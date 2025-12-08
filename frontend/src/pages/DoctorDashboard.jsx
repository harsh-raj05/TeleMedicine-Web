import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
// import Sidebar from "../components/Sidebar";


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

  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
     
  <div className="min-h-screen bg-gray-100">

    {/* HEADER */}
    <header
      className="relative bg-cover bg-center text-white py-8 px-10 shadow-lg"
      style={{ backgroundImage: "url('/images/doctorDash.png')" }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-none"></div>

      <div className="relative z-10 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">
            👨‍⚕️ {user.name}
          </h1>
          <p className="text-blue-100">
            Manage patient appointments efficiently
          </p>
        </div>

        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg shadow text-white transition"
        >
          Logout
        </button>
      </div>
    </header>


    {/* BODY */}
    <div className="max-w-6xl mx-auto px-8 py-10">

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

              {/* Info */}
              <div className="mt-4 text-gray-700 space-y-1 text-[15px]">
                <p>Date: {a.date}</p>
                <p>Time: {a.time}</p>
                <p>Reason: {a.reason}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-6 text-sm">
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
