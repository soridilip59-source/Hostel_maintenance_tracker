import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


function Navbar() {
  const navigate = useNavigate();
  const [dark, setDark] = useState(() => localStorage.getItem("theme") === "dark");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);
  function toggleTheme() { const next = !dark; setDark(next); localStorage.setItem("theme", next ? "dark" : "light"); }


  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");



    navigate("/", { replace: true });
  }


  const role = localStorage.getItem("role");
  const user = JSON.parse(localStorage.getItem("user") || "{}");


  return (
    <header className="topbar">
      <button className="mobile-menu-button" aria-label="Open navigation" onClick={() => window.dispatchEvent(new Event("toggle-sidebar"))}>☰</button>
      <div className="topbar-search"><span>⌕</span><input aria-label="Search" placeholder="Search anything..." /></div>
      <div className="topbar-actions">
        <button className="icon-button" aria-label="Notifications">♢<span className="notification-dot" /></button>
        <button className="icon-button theme-toggle" aria-label={dark ? "Switch to light mode" : "Switch to dark mode"} onClick={toggleTheme}>{dark ? "☀" : "☾"}</button>
        <div className="user-menu"><span className="avatar">{(user.name || (role === "admin" ? "Admin" : "Student")).charAt(0).toUpperCase()}</span><div><strong>{user.name || (role === "admin" ? "Admin" : "Student")}</strong><small>{role === "admin" ? "Administrator" : "Student"}</small></div><span className="chevron">⌄</span></div>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>
    </header>
  );
}


export default Navbar;
