import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

function StudentLayout({ children }) {
  return (
<<<<<<< HEAD
    <div className="app-layout">
      <Navbar />

      <div className="app-content">
        <Sidebar />
      <main>
=======
    <div className="app-shell">
      <Sidebar />
      <Navbar />
      <main className="main-content">
>>>>>>> 3ceaf172be1721b9777bbb9ad6c949d1f2a2c8d6
        {children}
      </main>
      </div>
    </div>
  );
}

export default StudentLayout;
