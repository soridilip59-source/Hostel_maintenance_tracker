import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRole }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // User is not logged in
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // User has wrong role
  if (allowedRole && role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  // Access allowed
  return children;
}

export default ProtectedRoute;