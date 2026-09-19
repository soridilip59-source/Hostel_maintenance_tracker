import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

function StudentLayout({ children }) {
  return (
    <div className="app-layout">
      <Navbar />

      <div className="app-content">
        <Sidebar />
      <main>
        {children}
      </main>
      </div>
    </div>
  );
}

export default StudentLayout;
