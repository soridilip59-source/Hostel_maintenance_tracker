import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const links = [["/student/dashboard", "▦", "Dashboard"], ["/student/assets", "▣", "Room Assets"], ["/student/report", "+", "Report Issue"], ["/student/requests", "≡", "My Requests"]];
  useEffect(() => {
    const toggle = () => document.getElementById("sidebar")?.classList.toggle("open");
    window.addEventListener("toggle-sidebar", toggle);
    return () => window.removeEventListener("toggle-sidebar", toggle);
  }, []);
  return (
<<<<<<< HEAD
    <aside className="app-sidebar">
      <h3>Student Menu</h3>

      <nav>
        <Link to="/student/dashboard">Dashboard</Link>

        <Link to="/student/assets">Room Assets</Link>

        <Link to="/student/report">Report Issue</Link>

        <Link to="/student/requests">My Requests</Link>
      </nav>
=======
    <aside className="sidebar" id="sidebar">
      <Link className="brand" to="/student/dashboard"><span className="brand-mark">⌂</span><span>Hostel <b>Maintenance</b><small>Tracker</small></span></Link>
      <p className="nav-label">Workspace</p>
      <nav className="side-nav">{links.map(([to, icon, label]) => <Link className={location.pathname === to ? "active" : ""} key={to} to={to}><span className="nav-icon">{icon}</span>{label}</Link>)}</nav>
      <div className="sidebar-footer"><div className="profile-mini"><span className="avatar">{(user.name || "S").charAt(0).toUpperCase()}</span><div><strong>{user.name || "Student"}</strong><small>{user.email || "student account"}</small></div></div></div>
>>>>>>> 3ceaf172be1721b9777bbb9ad6c949d1f2a2c8d6
    </aside>
  );
}

export default Sidebar;
