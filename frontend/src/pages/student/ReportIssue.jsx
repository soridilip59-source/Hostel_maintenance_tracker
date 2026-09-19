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

  // Fetch assets from MongoDB
  useEffect(() => {
    async function fetchAssets() {
      try {
        const response = await api.get("/assets");

        console.log("Assets response:", response.data);

        setAssets(response.data.data || response.data);
      } catch (error) {
        console.log("Fetch assets error:", error);

        if (error.response) {
          setError(error.response.data.message);
        } else {
          setError("Server is not running");
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

    if (asset === "") {
      setError("Please select an asset");
      return;
    }

    if (description === "") {
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

      // Clear form
      setAsset("");
      setDescription("");

      // Go to My Requests page
      setTimeout(() => {
        navigate("/student/requests");
      }, 1000);
    } catch (error) {
      console.log("Report issue error:", error);

      if (error.response) {
        setError(error.response.data.message);
      } else {
        setError("Server is not running");
      }
    }
  }

  return (
    <div>
      <h1>Report Damaged Item</h1>

      <p>Report an issue with an item in your room.</p>

      <form onSubmit={handleSubmit}>

        {/* Asset Dropdown */}
        <div>
          <label>Select Asset</label>

          <select
            value={asset}
            onChange={(e) => setAsset(e.target.value)}
          >
            <option value="">Select an asset</option>

            {loading ? (
              <option>Loading assets...</option>
            ) : (
              assets.map((item) => (
                <option
                  key={item._id}
                  value={item._id}
                >
                  {item.name} - {item.assetCode}
                </option>
              ))
            )}
          </select>
        </div>

        {/* Description */}
        <div>
          <label>Describe the problem</label>

          <textarea
            placeholder="Describe the damage or problem..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Error */}
        {error && <p>{error}</p>}

        {/* Success */}
        {message && <p>{message}</p>}

        {/* Submit */}
        <button type="submit">
          Report Issue
        </button>

      </form>
    </div>
  );
}

export default ReportIssue;