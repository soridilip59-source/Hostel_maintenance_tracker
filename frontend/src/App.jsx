import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

// Authentication
import Login from "./pages/Login";
import Signup from "./pages/Signup";

// Protection
import ProtectedRoute from "./components/ProtectedRoute";

// Student
import StudentLayout from "./pages/student/StudentLayout";
import StudentDashboard from "./pages/student/StudentDashboard";
import RoomAssets from "./pages/student/RoomAssets";
import ReportIssue from "./pages/student/ReportIssue";
import MyRequests from "./pages/student/MyRequests";

// Admin
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Requests from "./pages/admin/Requests";
import RequestDetails from "./pages/admin/RequestDetails";
import ManageAssets from "./pages/admin/ManageAssets";

function App() {
  useEffect(() => {
    document.documentElement.classList.toggle("dark", localStorage.getItem("theme") === "dark");
  }, []);
  return (
    <BrowserRouter>
      <Routes>

        {/* ================= AUTHENTICATION ================= */}

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />


        {/* ================= STUDENT ================= */}

        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute allowedRole="student">
              <StudentLayout>
                <StudentDashboard />
              </StudentLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/assets"
          element={
            <ProtectedRoute allowedRole="student">
              <StudentLayout>
                <RoomAssets />
              </StudentLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/report"
          element={
            <ProtectedRoute allowedRole="student">
              <StudentLayout>
                <ReportIssue />
              </StudentLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/requests"
          element={
            <ProtectedRoute allowedRole="student">
              <StudentLayout>
                <MyRequests />
              </StudentLayout>
            </ProtectedRoute>
          }
        />


        {/* ================= ADMIN ================= */}

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/requests"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminLayout>
                <Requests />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/requests/:id"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminLayout>
                <RequestDetails />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/assets"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminLayout>
                <ManageAssets />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
