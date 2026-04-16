import { useEffect, useState } from "react";
import API from "../services/api";
import { logout } from "../utils/auth";

function Navbar() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    API.get("/auth/profile").then(res => setUser(res.data));
  }, []);

  return (
    <div className="flex justify-between items-center px-6 py-4 bg-gray-900 text-white shadow">
      <h1 className="text-lg font-bold">💰 Finance Tracker</h1>

      <div className="flex items-center gap-4">

        <a href="/profile" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500 text-white flex items-center justify-center rounded-full">
            {user?.name?.charAt(0)}
          </div>
          <span>Profile</span>
        </a>

        <button
          onClick={() => {
            logout();
            window.location.href = "/login";
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