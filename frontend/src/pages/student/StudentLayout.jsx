import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

function StudentLayout({ children }) {
  return (
    <div>
      <Navbar />

      <Sidebar />

      <main>
        {children}
      </main>
    </div>
  );
}

export default StudentLayout;