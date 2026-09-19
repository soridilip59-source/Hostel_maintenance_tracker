import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    navigate("/");
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Welcome Admin</p>

      <button onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default AdminDashboard;