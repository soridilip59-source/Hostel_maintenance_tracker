import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import NotificationCenter from "./components/NotificationCenter";

// Authentication
import Login from "./pages/Login";
import Signup from "./pages/Signup";

// Protection
import ProtectedRoute from "./components/ProtectedRoute";

// Student
import StudentLayout from "./pages/student/StudentLayout";
import StudentDashboard from "./pages/student/StudentDashboard";
import ReportIssue from "./pages/student/ReportIssue";
import MyRequests from "./pages/student/MyRequests";
import StudentRequestDetails from "./pages/student/RequestDetails";
import Feedback from "./pages/student/Feedback";
import Profile from "./pages/student/Profile";

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
      <NotificationCenter />
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
        <Route path="/student/requests/:id" element={<ProtectedRoute allowedRole="student"><StudentLayout><StudentRequestDetails /></StudentLayout></ProtectedRoute>} />
        {/* Feedback route removed from UI */}
        <Route path="/student/profile" element={<ProtectedRoute allowedRole="student"><StudentLayout><Profile /></StudentLayout></ProtectedRoute>} />


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
        {/* Admin feedback route removed from UI */}

      </Routes>
    </BrowserRouter>
  );
}

export default App;
