import Navbar from "../../components/Navbar";
import { Link } from "react-router-dom";

function AdminLayout({ children }) {
  return (
    <div className="app-layout">
      <Navbar />

      <div className="app-content">
      <aside className="app-sidebar">
        <h3>Admin Menu</h3>

        <nav>
          <Link to="/admin/dashboard">
            Dashboard
          </Link>

          <Link to="/admin/requests">
            Maintenance Requests
          </Link>

          <Link to="/admin/assets">
            Manage Assets
          </Link>
        </nav>
      </aside>

      <main>
        {children}
      </main>
      </div>
    </div>
  );
}

export default AdminLayout;
