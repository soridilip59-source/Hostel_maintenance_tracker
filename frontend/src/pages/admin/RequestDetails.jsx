import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import StatusBadge from "../../components/StatusBadge";
import api from "../../services/api";

function RequestDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [request, setRequest] = useState(null);

  const [status, setStatus] = useState("");
  const [resolutionNote, setResolutionNote] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Get single maintenance request
  useEffect(() => {
    async function fetchRequest() {
      try {
        const response = await api.get(`/maintenance/${id}`);

        console.log("Request details:", response.data);

        const data = response.data.data || response.data;

        setRequest(data);
        setStatus(data.status);
        setResolutionNote(data.resolutionNote || "");
      } catch (error) {
        console.log("Fetch request error:", error);

        if (error.response) {
          setError(error.response.data.message);
        } else {
          setError("Server is not running");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchRequest();
  }, [id]);

  // Update request
  async function handleUpdate(e) {
    e.preventDefault();

    setError("");
    setMessage("");

    try {
      const response = await api.put(`/maintenance/${id}`, {
        status: status,
        resolutionNote: resolutionNote,
      });

      console.log("Update response:", response.data);

      setMessage("Request updated successfully");

      // Update local request data
      setRequest((previous) => ({
        ...previous,
        status: status,
        resolutionNote: resolutionNote,
      }));
    } catch (error) {
      console.log("Update request error:", error);

      if (error.response) {
        setError(error.response.data.message);
      } else {
        setError("Server is not running");
      }
    }
  }

  if (loading) {
    return <p>Loading request details...</p>;
  }

  if (!request) {
    return <p>Request not found.</p>;
  }

  return (
    <div>
      <h1>Request Details</h1>

      {/* Request ID */}
      <p>
        Request ID: {request._id}
      </p>

      {/* Asset Information */}
      <h3>Asset Information</h3>

      <p>
        Asset: {request.assetId?.name || "N/A"}
      </p>

      <p>
        Asset Code: {request.assetId?.assetCode || "N/A"}
      </p>

      <p>
        Hostel: {request.assetId?.hostel || "N/A"}
      </p>

      <p>
        Room: {request.assetId?.room || "N/A"}
      </p>

      {/* Complaint Information */}
      <h3>Complaint Information</h3>

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

      {/* Current Status */}
      <h3>Current Status</h3>

      <StatusBadge status={request.status} />

      {/* Update Form */}
      <form onSubmit={handleUpdate}>

        <div>
          <label>Update Status</label>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="Pending">
              Pending
            </option>

            <option value="In Progress">
              In Progress
            </option>

            <option value="Resolved">
              Resolved
            </option>
          </select>
        </div>

        <div>
          <label>Resolution Note</label>

          <textarea
            placeholder="Enter resolution details..."
            value={resolutionNote}
            onChange={(e) =>
              setResolutionNote(e.target.value)
            }
          />
        </div>

        {error && <p>{error}</p>}

        {message && <p>{message}</p>}

        <button type="submit">
          Update Request
        </button>

      </form>

      <br />

      <button onClick={() => navigate("/admin/requests")}>
        Back to Requests
      </button>
    </div>
  );
}

export default RequestDetails;