import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
function Profile() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        API.get("/auth/profile")
            .then((res) => setUser(res.data))
            .catch(() => alert("Error loading profile"));
    }, []);

    return (
        <div className="bg-gray-100 min-h-screen">
            <Navbar />

            <div className="flex justify-center mt-10">
                <div className="bg-white p-6 rounded shadow w-96">
                    <button
  onClick={() => navigate(-1)}
  className="mb-4 text-blue-500 hover:underline"
>
  ← Back
</button>
                    <div className="flex flex-col items-center mb-4">
                        <div className="w-12 h-12 bg-blue-500 text-white flex items-center justify-center rounded-full mb-2">
                            {user?.name?.charAt(0)}
                        </div>
                        <h2 className="text-xl font-bold">Profile</h2>
                    </div>

                    {user ? (
                        <>
                            <p><strong>Name:</strong> {user.name}</p>
                            <p><strong>Email:</strong> {user.email}</p>
                        </>
                    ) : (
                        <p>Loading...</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Profile;