import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

function WritePrescription() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    symptoms: "",
    diagnosis: "",
    medicines: "",
    instructions: "",
  });

  const handleSubmit = async () => {
    await api.put(
      `/appointments/prescription/${id}`,
      form,
      { headers: { Authorization: "Bearer " + token } }
    );

    alert("Prescription saved!");
    navigate("/doctor-dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-8 bg-[url('/images/prescription1.jpg')]">
      <div className="bg-white rounded-2xl shadow-xl p-10 max-w-2xl w-full border-2">

        <h2 className="text-3xl font-bold text-center text-blue-700 mb-8">
          Write Prescription
        </h2>

        <div className="space-y-6">``
          <div>
            <label className="font-semibold">Symptoms</label>
            <textarea
              name="symptoms"
              className="w-full border p-3 rounded-lg h-24 focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setForm({ ...form, symptoms: e.target.value })}
            />
          </div>

          <div>
            <label className="font-semibold">Diagnosis</label>
            <textarea
              name="diagnosis"
              className="w-full border p-3 rounded-lg h-24 focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setForm({ ...form, diagnosis: e.target.value })}
            />
          </div>

          <div>
            <label className="font-semibold">Medicines</label>
            <textarea
              name="medicines"
              className="w-full border p-3 rounded-lg h-24 focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setForm({ ...form, medicines: e.target.value })}
            />
          </div>

          <div>
            <label className="font-semibold">Instructions</label>
            <textarea
              name="instructions"
              className="w-full border p-3 rounded-lg h-24 focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setForm({ ...form, instructions: e.target.value })}
            />
          </div>

          <div className="flex justify-between mt-6">
            <button
              onClick={() => navigate("/doctor-dashboard")}
              className="bg-gray-400 text-white px-5 py-3 rounded-lg hover:bg-gray-500"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700"
            >
              Save Prescription
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default WritePrescription;
