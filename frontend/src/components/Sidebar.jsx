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
    <aside className="sidebar" id="sidebar">
      <Link className="brand" to="/student/dashboard"><span className="brand-mark">⌂</span><span>Hostel <b>Maintenance</b><small>Tracker</small></span></Link>
      <p className="nav-label">Workspace</p>
      <nav className="side-nav">{links.map(([to, icon, label]) => <Link className={location.pathname === to ? "active" : ""} key={to} to={to}><span className="nav-icon">{icon}</span>{label}</Link>)}</nav>
      <div className="sidebar-footer"><div className="profile-mini"><span className="avatar">{(user.name || "S").charAt(0).toUpperCase()}</span><div><strong>{user.name || "Student"}</strong><small>{user.email || "student account"}</small></div></div></div>
    </aside>
  );
}


export default Sidebar;



