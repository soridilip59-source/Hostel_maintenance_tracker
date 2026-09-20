import { useNavigate } from "react-router-dom";


function Navbar() {
  const navigate = useNavigate();


  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");


    navigate("/", { replace: true });
  }


  const role = localStorage.getItem("role");
  const user = JSON.parse(localStorage.getItem("user") || "{}");


  return (
    <header className="topbar">
      <button className="mobile-menu-button" aria-label="Open navigation" onClick={() => window.dispatchEvent(new Event("toggle-sidebar"))}>☰</button>
      <div className="topbar-search"><span>⌕</span><input placeholder="Search requests, assets, or users..." /></div>
      <div className="topbar-actions">
        <button className="icon-button" aria-label="Notifications">♢<span className="notification-dot" /></button>
        <div className="user-menu"><span className="avatar">{(user.name || (role === "admin" ? "Admin" : "Student")).charAt(0).toUpperCase()}</span><div><strong>{user.name || (role === "admin" ? "Admin" : "Student")}</strong><small>{role === "admin" ? "Administrator" : "Student"}</small></div><span className="chevron">⌄</span></div>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>
    </header>
  );
}


export default Navbar;
