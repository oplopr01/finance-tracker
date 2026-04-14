import { useState } from "react";
import API from "../services/api";

function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!form.name || !form.email || !form.password) {
      return "All fields are required";
    }
    if (!form.email.includes("@")) {
      return "Invalid email";
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validate();
    if (validationError) {
      return setError(validationError);
    }

    try {
      setLoading(true);
      const res = await API.post("/auth/register", form);
      localStorage.setItem("token", res.data.token);
      window.location.href = "/";
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600">
      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-lg w-96 text-white animate-fadeIn">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>

        {error && (
          <div className="bg-red-500 text-white p-2 rounded mb-3 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4" autoComplete="off">
          <input
            className="p-2 rounded bg-white/20 outline-none focus:ring-2 focus:ring-white"
            placeholder="Name"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            className="p-2 rounded bg-white/20 outline-none focus:ring-2 focus:ring-white"
            placeholder="Email"
            autoComplete="off"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            type="password"
            className="p-2 rounded bg-white/20 outline-none focus:ring-2 focus:ring-white"
            placeholder="Password"
            autoComplete="new-password"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <button
            disabled={loading}
            className={`p-2 rounded font-semibold transition ${
              loading
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-white text-indigo-600 hover:bg-gray-200"
            }`}
          >
            {loading ? "Creating..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;