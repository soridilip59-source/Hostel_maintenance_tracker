import { useState, useEffect } from "react";
import api from "../../services/api";

function StudentDashboard() {
  const [assets, setAssets] = useState([]);
  const [requests, setRequests] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const assetsResponse = await api.get("/assets");
        const requestsResponse = await api.get("/maintenance");

        console.log("Assets:", assetsResponse.data);
        console.log("Requests:", requestsResponse.data);

        setAssets(
          assetsResponse.data.data || assetsResponse.data
        );

        setRequests(
          requestsResponse.data.data || requestsResponse.data
        );
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

    fetchDashboardData();
  }, []);

  const totalAssets = assets.length;

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
      <h1>Student Dashboard</h1>

      <p>
        Welcome to Hostel Maintenance Tracker
      </p>

      {error && <p>{error}</p>}

      <div>

        {/* Total Assets */}
        <div>
          <h3>Total Assets</h3>
          <p>{totalAssets}</p>
        </div>

        {/* Pending Requests */}
        <div>
          <h3>Pending Requests</h3>
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

export default StudentDashboard;