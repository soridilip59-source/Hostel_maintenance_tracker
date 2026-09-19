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
    <nav>
      <h2>Hostel Maintenance</h2>

      <div>
        <span>
          {role === "admin" ? "Admin" : "Student"}
        </span>

        <button onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;