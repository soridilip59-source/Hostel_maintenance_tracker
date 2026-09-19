import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function ReportIssue() {
  const navigate = useNavigate();

  const [asset, setAsset] = useState("");
  const [description, setDescription] = useState("");

  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Fetch assets
  useEffect(() => {
    async function fetchAssets() {
      try {
        const response = await api.get("/assets");

        console.log("Assets response:", response.data);

        // Handle API response
        const assetData = response.data.data || response.data;

        if (Array.isArray(assetData)) {
          setAssets(assetData);
        } else {
          setAssets([]);
          setError("No assets found");
        }
      } catch (error) {
        console.log("Fetch assets error:", error);

        if (error.response) {
          setError(
            error.response.data.message || "Failed to load assets"
          );
        } else {
          setError("Cannot reach the backend server. Please check that it is running.");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchAssets();
  }, []);

  // Submit maintenance request
  async function handleSubmit(e) {
    e.preventDefault();

    if (!asset) {
      setError("Please select an asset");
      return;
    }

    if (!description.trim()) {
      setError("Please describe the problem");
      return;
    }

    setError("");
    setMessage("");

    try {
      const response = await api.post("/maintenance", {
        assetId: asset,
        description: description,
      });

      console.log("Maintenance response:", response.data);

      setMessage("Issue reported successfully");

      setAsset("");
      setDescription("");

      setTimeout(() => {
        navigate("/student/requests");
      }, 1000);
    } catch (error) {
      console.log("Report issue error:", error);

      if (error.response) {
        setError(
          error.response.data.message || "Failed to report issue"
        );
      } else {
        setError("Cannot reach the backend server. Please check that it is running.");
      }
    }
  }

  return (
    <div>
      <h1>Report Damaged Item</h1>

      <p>Report an issue with an item in your room.</p>

      {!loading && assets.length === 0 && !error && (
        <p>No assets are available yet. Ask an admin to add assets first.</p>
      )}

      <form onSubmit={handleSubmit}>

        {/* Asset */}
        <div>
          <label>Select Asset</label>

          <select
            value={asset}
            onChange={(e) => {
              setAsset(e.target.value);
              setError("");
            }}
            disabled={loading}
            required
          >
            <option value="">
              {loading ? "Loading assets..." : "Select an asset"}
            </option>

            {assets.map((item) => (
              <option key={item._id} value={item._id}>
                {item.name} - {item.assetCode}
              </option>
            ))}
          </select>
        </div>

        {/* Problem Description */}
        <div>
          <label>Describe the problem</label>

          <textarea
            placeholder="Describe the damage or problem..."
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setError("");
            }}
          />
        </div>

        {/* Error */}
        {error && <p>{error}</p>}

        {/* Success */}
        {message && <p>{message}</p>}

        <button type="submit" disabled={loading || assets.length === 0}>
          Report Issue
        </button>

      </form>
    </div>
  );
}

export default ReportIssue;
