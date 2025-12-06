import { useEffect, useState } from "react";
import api from "../services/api";

function BookAppointment() {
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({});
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchDoctors = async () => {
      const res = await api.get("/auth/doctors");
      setDoctors(res.data);
    };
    fetchDoctors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await api.post(
      "/appointments/book",
      {
        patient: user.id,
        doctor: form.doctor,
        date: form.date,
        time: form.time,
        reason: form.reason,
      },
      { headers: { Authorization: "Bearer " + token } }
    );

    alert("Appointment booked!");
    window.location.href = "/patient-dashboard";
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-6">
      <div className="bg-white p-10 rounded-2xl shadow-xl max-w-lg w-full">

        <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
          Book Appointment
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">

          <select
            name="doctor"
            onChange={(e) => setForm({ ...form, doctor: e.target.value })}
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Doctor</option>
            {doctors.map((d) => (
              <option key={d._id} value={d._id}>
                {d.name}
              </option>
            ))}
          </select>

          <input
            type="date"
            name="date"
            required
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="time"
            name="time"
            required
            onChange={(e) => setForm({ ...form, time: e.target.value })}
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          <textarea
            name="reason"
            required
            placeholder="Reason for appointment"
            onChange={(e) => setForm({ ...form, reason: e.target.value })}
            className="w-full border p-3 rounded-lg h-24 focus:ring-2 focus:ring-blue-500"
          ></textarea>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
          >
            Book Appointment
          </button>
        </form>

      </div>
    </div>
  );
}

export default BookAppointment;
