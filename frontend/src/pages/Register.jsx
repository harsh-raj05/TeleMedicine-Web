import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const SPECIALIZATIONS = [
  { value: "general-physician", label: "General Physician" },
  { value: "dermatologist", label: "Dermatologist (Skin)" },
  { value: "cardiologist", label: "Cardiologist (Heart)" },
  { value: "dentist", label: "Dentist (Teeth)" },
  { value: "orthopedic", label: "Orthopedic (Bones/Joints)" },
  { value: "neurologist", label: "Neurologist (Brain/Nerves)" },
  { value: "pediatrician", label: "Pediatrician (Children)" },
  { value: "gynecologist", label: "Gynecologist (Women's Health)" },
  { value: "psychiatrist", label: "Psychiatrist (Mental Health)" },
  { value: "ophthalmologist", label: "Ophthalmologist (Eyes)" },
  { value: "ent-specialist", label: "ENT Specialist (Ear/Nose/Throat)" },
  { value: "pulmonologist", label: "Pulmonologist (Lungs)" },
  { value: "gastroenterologist", label: "Gastroenterologist (Digestive)" },
];

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    specialization: "",
    contactNumber: "",
    degreeQualification: "",
    workingExperience: ""
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare data - only include doctor fields if doctor
    const submitData = {
      name: form.name,
      email: form.email,
      password: form.password,
      role: form.role
    };

    if (form.role === "doctor") {
      submitData.specialization = form.specialization;
      submitData.contactNumber = form.contactNumber;
      submitData.degreeQualification = form.degreeQualification;
      submitData.workingExperience = form.workingExperience;
    }

    try {
      await api.post("/auth/register", submitData);
      alert("Registration successful!");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-linear-to-br from-indigo-100 to-blue-200 px-4">

      <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-2">
          Create Account
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Join the TeleHealth platform
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">

          <input
            name="name"
            placeholder="Full Name"
            required
            onChange={handleChange}
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            onChange={handleChange}
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            onChange={handleChange}
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          <select
            name="role"
            required
            onChange={handleChange}
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="">Select Role</option>
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
          </select>

          {/* Conditional Specialization Dropdown - Only shows when Doctor is selected */}
          {form.role === "doctor" && (
            <select
              name="specialization"
              required
              onChange={handleChange}
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-indigo-50"
            >
              <option value="">Select Specialization</option>
              {SPECIALIZATIONS.map((spec) => (
                <option key={spec.value} value={spec.value}>
                  {spec.label}
                </option>
              ))}
            </select>
          )}

          {/* Doctor Profile Fields - Only shows when Doctor is selected */}
          {form.role === "doctor" && (
            <>
              <input
                name="contactNumber"
                type="tel"
                placeholder="Contact Number"
                required
                onChange={handleChange}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-indigo-50"
              />

              <input
                name="degreeQualification"
                placeholder="Degree Qualification (e.g., MBBS, MD)"
                required
                onChange={handleChange}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-indigo-50"
              />

              <input
                name="workingExperience"
                placeholder="Working Experience (e.g., 5 years)"
                required
                onChange={handleChange}
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-indigo-50"
              />
            </>
          )}

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold shadow-md transition cursor-pointer"
          >
            Register
          </button>

          <p className="text-center text-gray-600">
            Already have an account?
            <Link className="text-indigo-600 ml-1 hover:underline" to="/login">
              Login here
            </Link>
          </p>

        </form>
      </div>
    </div>
  );
}

export default Register;

