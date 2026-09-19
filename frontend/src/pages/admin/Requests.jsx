import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import StatusBadge from "../../components/StatusBadge";
import api from "../../services/api";

function Requests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchRequests() {
      try {
        const response = await api.get("/maintenance");

        console.log("Admin requests:", response.data);

        setRequests(response.data.data || response.data);
      } catch (error) {
        console.log("Fetch requests error:", error);

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

  if (loading) {
    return <p>Loading maintenance requests...</p>;
  }

  return (
    <div>
      <h1>Maintenance Requests</h1>

      <p>View and manage all maintenance requests.</p>

      {error && <p>{error}</p>}

      {requests.length === 0 ? (
        <p>No maintenance requests found.</p>
      ) : (
        requests.map((request) => (
          <div key={request._id}>

            <h3>
              {request.assetId?.name || "Asset"}
            </h3>

            <p>
              Room: {request.assetId?.room || "N/A"}
            </p>

            <p>
              Asset Code: {request.assetId?.assetCode || "N/A"}
            </p>

            <p>
              Reported By:{" "}
              {request.reportedBy?.name || "Unknown"}
            </p>

            <p>
              Description: {request.description}
            </p>

            <p>
              Date:{" "}
              {request.createdAt
                ? new Date(request.createdAt).toLocaleDateString()
                : "N/A"}
            </p>

            <StatusBadge status={request.status} />

            <br />

            <Link to={`/admin/requests/${request._id}`}>
              View Details
            </Link>

          </div>
        ))
      )}
    </div>
  );
}

export default Requests;