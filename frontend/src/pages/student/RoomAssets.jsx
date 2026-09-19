import { useEffect, useState } from "react";
import AssetCard from "../../components/AssetCard";
import api from "../../services/api";

function RoomAssets() {
  const [assets, setAssets] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState("");
  useEffect(() => { api.get("/assets").then((response) => setAssets(response.data?.data || [])).catch((requestError) => setError(requestError.response?.data?.message || "Unable to load room assets.")).finally(() => setLoading(false)); }, []);
  return <><div className="page-header"><div><p className="eyebrow">Your room</p><h1>Room Assets</h1><p className="subtitle">Browse the assets available in your hostel room.</p></div><span className="page-date">{assets.length} assets</span></div>{loading ? <div className="loading-state">Loading room assets...</div> : error ? <div className="error-state">{error}</div> : assets.length === 0 ? <div className="empty-state">No assets have been added yet.</div> : <div className="asset-grid">{assets.map((asset) => <AssetCard key={asset._id} asset={asset} />)}</div>}
  </>;
}
export default RoomAssets;
