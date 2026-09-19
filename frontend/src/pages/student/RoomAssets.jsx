import { useState, useEffect } from "react";
import AssetCard from "../../components/AssetCard";
import api from "../../services/api";

function RoomAssets() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchAssets() {
      try {
        const response = await api.get("/assets");

        console.log("Assets response:", response.data);

        const assetData = response.data.data || response.data;
        setAssets(Array.isArray(assetData) ? assetData : []);
      } catch (error) {
        console.log("Fetch assets error:", error);

        if (error.response) {
          setError(error.response.data.message);
        } else {
          setError("Cannot reach the backend server. Please check that it is running.");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchAssets();
  }, []);

  if (loading) {
    return <p>Loading assets...</p>;
  }

  return (
    <div>
      <h1>Room Assets</h1>

      <p>Assets available in your room</p>

      {error && <p>{error}</p>}

      {assets.length === 0 ? (
        <p>No assets found.</p>
      ) : (
        assets.map((asset) => (
          <AssetCard
            key={asset._id}
            asset={asset}
          />
        ))
      )}
    </div>
  );
}

export default RoomAssets;
