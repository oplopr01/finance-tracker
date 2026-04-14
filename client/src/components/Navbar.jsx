import { logout } from "../utils/auth";

function Navbar() {
  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  return (
    <div className="flex justify-between p-4 bg-gray-800 text-white">
      <h1>Finance Tracker</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Navbar;