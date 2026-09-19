import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="app-sidebar">
      <h3>Student Menu</h3>

      <nav>
        <Link to="/student/dashboard">Dashboard</Link>

        <Link to="/student/assets">Room Assets</Link>

        <Link to="/student/report">Report Issue</Link>

        <Link to="/student/requests">My Requests</Link>
      </nav>
    </aside>
  );
}

export default Sidebar;
