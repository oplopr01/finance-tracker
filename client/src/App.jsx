import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Toaster } from "react-hot-toast";
import { isLoggedIn } from "./utils/auth";

// ✅ Lazy load pages (performance boost)
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Profile = lazy(() => import("./pages/Profile"));

// ✅ Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  return isLoggedIn() ? children : <Navigate to="/login" />;
};

// ✅ Public route (prevent access if logged in)
const PublicRoute = ({ children }) => {
  return !isLoggedIn() ? children : <Navigate to="/" />;
};

// ✅ Simple fallback loader
const PageLoader = () => (
  <div className="h-screen flex items-center justify-center">
    <p className="text-gray-500">Loading...</p>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />

      <Suspense fallback={<PageLoader />}>
        <Routes>

          {/* Public Routes */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;