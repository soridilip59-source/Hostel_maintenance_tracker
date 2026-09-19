import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

function StudentLayout({ children }) {
  return (
    <div className="app-shell">
      <Sidebar />
      <Navbar />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

export default StudentLayout;