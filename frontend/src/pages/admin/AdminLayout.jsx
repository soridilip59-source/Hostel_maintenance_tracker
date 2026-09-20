import Navbar from "../../components/Navbar";
import { Link, useLocation } from "react-router-dom";


function AdminLayout({ children }) {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const links = [["/admin/dashboard", "▦", "Dashboard"], ["/admin/requests", "≡", "Maintenance Requests"], ["/admin/assets", "▣", "Assets"]];
  return (
    <div className="app-shell">
      <aside className="sidebar" id="sidebar">
        <Link className="brand" to="/admin/dashboard"><span className="brand-mark">⌂</span><span>Hostel <b>Maintenance</b><small>Tracker</small></span></Link>
        <p className="nav-label">Workspace</p>
        <nav className="side-nav">{links.map(([to, icon, label]) => <Link className={location.pathname === to ? "active" : ""} key={to} to={to}><span className="nav-icon">{icon}</span>{label}</Link>)}</nav>
        <p className="nav-label secondary-label">Management</p>
        <nav className="side-nav"><Link to="/admin/assets"><span className="nav-icon">◎</span>Users</Link><Link to="/admin/requests"><span className="nav-icon">▤</span>Reports</Link></nav>
        <div className="sidebar-footer"><div className="profile-mini"><span className="avatar">{(user.name || "A").charAt(0).toUpperCase()}</span><div><strong>{user.name || "Admin"}</strong><small>{user.email || "admin account"}</small></div></div></div>
      </aside>
      <Navbar />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}


export default AdminLayout;
