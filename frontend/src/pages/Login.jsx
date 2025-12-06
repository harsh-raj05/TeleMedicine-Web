import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

function Login() {
  const [form, setForm] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/login", form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate(
        res.data.user.role === "doctor"
          ? "/doctor-dashboard"
          : "/patient-dashboard"
      );
    } catch (err) {
      alert("Invalid login");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center 
      bg-[url('/images/telemed5.jpg')] bg-cover bg-center bg-no-repeat px-4">

      <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-md mr-160">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-2">
          TeleMedicine Login
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Access your healthcare portal
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold shadow-md transition"
          >
            Login
          </button>

          <p className="text-center text-gray-600">
            New here?
            <Link className="text-blue-600 ml-1 hover:underline" to="/register">
              Create account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
