import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    navigate("/", { replace: true });
  }

  const role = localStorage.getItem("role");

  return (
    <nav className="app-navbar">
      <h2>Hostel Maintenance</h2>

      <div className="navbar-actions">
        <span className="role-label">
          {role === "admin" ? "Admin" : "Student"}
        </span>

        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
