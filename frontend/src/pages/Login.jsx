import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { Mail, Lock } from "lucide-react"; 

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
    <div className="min-h-screen flex justify-center items-center bg-center bg-cover bg-no-repeat relative"
      style={{
        backgroundImage: "url('/images/telemed9.gif')"
      }}>

      <div className="absolute inset-0 bg-black/40 backdrop-blur-none" />

      <div className="relative bg-white/90 p-10 rounded-2xl shadow-xl w-full max-w-md ml-80">
        <h2 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-indigo-600 tracking-wide mb-2">
          TeleMedicine Login
        </h2>

        <p className="text-center text-gray-600 mb-8">
          Access your healthcare portal
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div className="flex items-center border rounded-lg p-3 bg-white shadow-sm">
            <Mail className="text-gray-400 mr-3" size={20}/>
            <input
              name="email"
              type="email"
              placeholder="Email"
              onChange={handleChange}
              className="w-full outline-none"
            />
          </div>

          <div className="flex items-center border rounded-lg p-3 bg-white shadow-sm">
            <Lock className="text-gray-400 mr-3" size={20}/>
            <input
              name="password"
              type="password"
              placeholder="Password"
              onChange={handleChange}
              className="w-full outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold shadow-md transition"
          >
            Login
          </button>

          <p className="text-center text-gray-700">
            New user?
            <Link className="text-blue-600 ml-1 hover:underline font-medium" to="/register">
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
