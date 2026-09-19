import Login from "./pages/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import StudentDashboard from "./pages/student/StudentDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProtectedRoutes  from "./components/ProtectedRoutes";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/student/dashboard" element={<ProtectedRoutes allowedRole ="student">
                    <StudentDashboard />
                </ProtectedRoutes>} />
                <Route path="/admin/dashboard" element={<ProtectedRoutes allowedRole="admin">
                    <AdminDashboard/>
                </ProtectedRoutes> } />

            </Routes>
        </BrowserRouter>
    );
}

export default App