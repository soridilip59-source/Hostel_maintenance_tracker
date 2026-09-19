 import { useNavigate } from "react-router-dom";

function StudentDashboard() {
    const navigate = useNavigate();

    function  handleLogout(){
        localStorage.removeItem("token");
        localStorage.removeItem("role");

        navigate("/")
    }
  return (
    <div> 
        <h1>Student Dashboard</h1>
        <p>Welcome Student</p>

        <button onClick={handleLogout}> Logout</button>
    </div>
  )
}

export default StudentDashboard