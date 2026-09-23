import { useEffect } from "react";
import Navbar from "../../components/Navbar";
import { Link, NavLink, useLocation } from "react-router-dom";
import UserAvatar, { displayName } from "../../components/UserAvatar";

function AdminLayout({ children }) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const location = useLocation();
  const links = [["/admin/dashboard", "▦", "Dashboard"], ["/admin/requests", "≡", "All Complaints"], ["/admin/assets", "▣", "Assets"]];

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
    <div className="app-shell">
      <aside className="sidebar" id="sidebar">
        <Link className="brand" to="/admin/dashboard"><span className="brand-mark"><img src="/assets/navgurukul-logo.png" alt="NavGurukul logo" /></span><span>Hostel <b>Maintenance</b><small>Tracker</small></span></Link>
        <p className="nav-label">Workspace</p>
        <nav className="side-nav">{links.map(([to, icon, label]) => <NavLink key={to} to={to} end={to === "/admin/dashboard"} className={({ isActive }) => (isActive || location.pathname === to ? "active" : "")} onClick={() => document.getElementById("sidebar")?.classList.remove("open")}><span className="nav-icon">{icon}</span>{label}</NavLink>)}</nav>
        <div className="sidebar-footer">
          <div className="profile-mini">
            <UserAvatar user={user} size="sm" className="avatar" />
            <div><strong>{displayName(user) || "Admin"}</strong><small>{user.email || "admin account"}</small></div>
          </div>
          <button type="button" className="logout-button sidebar-logout" onClick={handleLogout}>Logout</button>
        </div>
      </aside>
      <Navbar />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

export default AdminLayout;
