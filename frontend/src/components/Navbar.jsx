import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserAvatar, { displayName } from "./UserAvatar";

function Navbar() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [dark, setDark] = useState(() => localStorage.getItem("theme") === "dark");
  const [search, setSearch] = useState("");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  const title = useMemo(() => {
    if (role === "admin") return "Administrator";
    return "Student";
  }, [role]);

  function toggleTheme() {
    setDark((current) => !current);
  }

  const submitSearch = (event) => {
    event.preventDefault();
    const destination = role === "admin" ? "/admin/requests" : "/student/requests";
    navigate(search.trim() ? `${destination}?q=${encodeURIComponent(search.trim())}` : destination);
  };

  return (
    <header className="topbar">
      <button className="mobile-menu-button" aria-label="Open navigation" onClick={() => window.dispatchEvent(new Event("toggle-sidebar"))}>☰</button>

      <form className="topbar-search" onSubmit={submitSearch}>
        <span>⌕</span>
        <input aria-label="Search complaints" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search complaints…" />
      </form>

      <div className="topbar-actions">
        <button className="icon-button theme-toggle" aria-label={dark ? "Switch to light mode" : "Switch to dark mode"} onClick={toggleTheme}>{dark ? "☀" : "☾"}</button>

        <div className="user-menu">
          <UserAvatar user={user} size="sm" className="avatar" />
          <div>
            <strong>{displayName(user) || title}</strong>
            <small>{title}</small>
          </div>
          <span className="chevron">⌄</span>
        </div>

      </div>
    </header>
  );
}

export default Navbar;
