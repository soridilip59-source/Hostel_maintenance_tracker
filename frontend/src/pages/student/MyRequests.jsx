import { useState, useEffect } from "react";
import StatusBadge from "../../components/StatusBadge";
import api from "../../services/api";

function MyRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchRequests() {
      try {
        const response = await api.get("/maintenance");

        console.log("Maintenance response:", response.data);

        const requestData = response.data.data || response.data;
        setRequests(Array.isArray(requestData) ? requestData : []);
      } catch (error) {
        console.log("Fetch requests error:", error);

        if (error.response) {
          setError(error.response.data.message);
        } else {
          setError("Cannot reach the backend server. Please check that it is running.");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchRequests();
  }, []);

  if (loading) {
    return <p>Loading requests...</p>;
  }

  return (
    <div>
      <h1>My Requests</h1>

      <p>View your submitted maintenance requests.</p>

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
              Description: {request.description}
            </p>

            <p>
              Date:{" "}
              {new Date(request.createdAt).toLocaleDateString()}
            </p>

            <StatusBadge status={request.status} />
          </div>
        ))
      )}
    </div>
  );
}

export default MyRequests;
