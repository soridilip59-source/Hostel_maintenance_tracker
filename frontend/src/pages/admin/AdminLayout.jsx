import Navbar from "../../components/Navbar";
import { Link } from "react-router-dom";

function AdminLayout({ children }) {
  return (
    <div>
      <Navbar />

      <aside>
        <h3>Admin Menu</h3>

        <nav>
          <Link to="/admin/dashboard">
            Dashboard
          </Link>

          <Link to="/admin/requests">
            Maintenance Requests
          </Link>
        </nav>
      </aside>

      <main>
        {children}
      </main>
    </div>
  );
}

export default AdminLayout;