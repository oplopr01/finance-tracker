import { useEffect, useState } from "react";
import API from "../services/api";
import { logout } from "../utils/auth";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/auth/profile")
      .then((res) => setUser(res.data))
      .catch(() => {
        // optional: handle error silently
      });
  }, []);

  return (
    <div className="flex justify-between items-center px-6 py-4 bg-gray-900 text-white shadow">
      
      {/* Logo / Title */}
      <h1 className="text-lg font-bold">💰 Finance Tracker</h1>

      <div className="flex items-center gap-4">

        {/* ✅ Profile Link (NO reload) */}
        <Link
          to="/profile"
          className="flex items-center gap-2 hover:opacity-80 transition"
        >
          <div className="w-8 h-8 bg-blue-500 text-white flex items-center justify-center rounded-full">
            {user?.name?.charAt(0)}
          </div>
          <span>Profile</span>
        </Link>

        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
        >
          Logout
        </button>

      </div>
    </div>
  );
}

export default Navbar;