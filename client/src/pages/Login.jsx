import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await API.post("/auth/login", form);
    localStorage.setItem("token", res.data.token);
    window.location.href = "/";
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600">

      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-lg w-96 text-white">
        <h2 className="text-2xl font-bold mb-6 text-center">Welcome Back</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            className="p-2 rounded bg-white/20 outline-none"
            placeholder="Email"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            type="password"
            className="p-2 rounded bg-white/20 outline-none"
            placeholder="Password"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <button className="bg-white text-indigo-600 font-semibold p-2 rounded hover:bg-gray-200">
            Login
          </button>

        </form>
        <Link
          to="/register"
          className="mt-4 block text-center border border-white p-2 rounded hover:bg-white hover:text-indigo-600"
        >
          Create Account
        </Link>
      </div>

    </div>
  );
}

export default Login;