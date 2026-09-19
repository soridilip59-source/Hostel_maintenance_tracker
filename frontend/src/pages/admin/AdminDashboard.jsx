import { useState, useEffect } from "react";
import api from "../../services/api";

function AdminDashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchRequests() {
      try {
        const response = await api.get("/maintenance");

        console.log("Dashboard requests:", response.data);

        setRequests(response.data.data || response.data);
      } catch (error) {
        console.log("Dashboard error:", error);

        if (error.response) {
          setError(error.response.data.message);
        } else {
          setError("Server is not running");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchRequests();
  }, []);

  // Calculate request counts
  const totalRequests = requests.length;

  const pendingRequests = requests.filter(
    (request) => request.status === "Pending"
  ).length;

  const inProgressRequests = requests.filter(
    (request) => request.status === "In Progress"
  ).length;

  const resolvedRequests = requests.filter(
    (request) => request.status === "Resolved"
  ).length;

  if (loading) {
    return <p>Loading dashboard...</p>;
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>

      <p>
        Manage hostel maintenance requests.
      </p>

      {error && <p>{error}</p>}

      <div>

        {/* Total */}
        <div>
          <h3>Total Requests</h3>
          <p>{totalRequests}</p>
        </div>

        {/* Pending */}
        <div>
          <h3>Pending</h3>
          <p>{pendingRequests}</p>
        </div>

        {/* In Progress */}
        <div>
          <h3>In Progress</h3>
          <p>{inProgressRequests}</p>
        </div>

        {/* Resolved */}
        <div>
          <h3>Resolved</h3>
          <p>{resolvedRequests}</p>
        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;