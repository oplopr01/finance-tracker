import { useState } from "react";
import API from "../services/api";

function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await API.post("/auth/register", form);
    localStorage.setItem("token", res.data.token);
    window.location.href = "/";
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600">
      
      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-lg w-96 text-white">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            className="p-2 rounded bg-white/20 outline-none"
            placeholder="Name"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
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
            Register
          </button>
        </form>
      </div>

    </div>
  );
}

export default Register;