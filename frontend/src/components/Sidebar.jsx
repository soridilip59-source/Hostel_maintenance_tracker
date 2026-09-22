import { useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import UserAvatar, { displayName } from "./UserAvatar";

function Sidebar() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const location = useLocation();
  const links = [
    ["/student/dashboard", "▦", "Dashboard"],
    ["/student/report", "+", "Report Issue"],
    ["/student/requests", "≡", "All Complaints"],
    ["/student/feedback", "★", "Feedback"],
    ["/student/profile", "◉", "Profile"]
  ];

  useEffect(() => {
    const toggle = () => document.getElementById("sidebar")?.classList.toggle("open");
    window.addEventListener("toggle-sidebar", toggle);
    return () => window.removeEventListener("toggle-sidebar", toggle);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <aside className="sidebar" id="sidebar">
      <Link className="brand" to="/student/dashboard">
        <span className="brand-mark"><img src="/assets/navgurukul-logo.png" alt="NavGurukul logo" /></span>
        <span>
          Hostel <b>Maintenance</b>
          <small>Tracker</small>
        </span>
      </Link>

      <p className="nav-label">Workspace</p>
      <nav className="side-nav">
        {links.map(([to, icon, label]) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/student/dashboard"}
            className={({ isActive }) => (isActive || location.pathname === to ? "active" : "")}
            onClick={() => document.getElementById("sidebar")?.classList.remove("open")}
          >
            <span className="nav-icon">{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="profile-mini">
          <UserAvatar user={user} size="sm" className="avatar" />
          <div>
            <strong>{displayName(user) || "Student"}</strong>
            <small>{user.email || "student account"}</small>
          </div>
        </div>
        <button type="button" className="logout-button sidebar-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
