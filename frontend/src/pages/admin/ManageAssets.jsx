import { useEffect, useState } from "react";
import api from "../../services/api";


const emptyAsset = {
  name: "",
  assetCode: "",
  category: "",
  hostel: "",
  room: "",
  condition: "Good",
};


function ManageAssets() {
  const [assets, setAssets] = useState([]);
  const [form, setForm] = useState(emptyAsset);
  const [editingId, setEditingId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");


  const getMessage = (requestError, fallback) =>
    requestError.response?.data?.message ||
    (requestError.request ? "Cannot reach the backend server" : fallback);


  async function loadAssets() {
    try {
      const response = await api.get("/assets");
      setAssets(Array.isArray(response.data.data) ? response.data.data : []);
    } catch (requestError) {
      setError(getMessage(requestError, "Failed to load assets"));
    } finally {
      setLoading(false);
    }
  }


  useEffect(() => {
    async function fetchAssets() {
      try {
        const response = await api.get("/assets");
        setAssets(Array.isArray(response.data.data) ? response.data.data : []);
      } catch (requestError) {
        setError(getMessage(requestError, "Failed to load assets"));
      } finally {
        setLoading(false);
      }
    }


    fetchAssets();
  }, []);


  function updateField(event) {
    setForm((previous) => ({ ...previous, [event.target.name]: event.target.value }));
  }


  function cancelEdit() {
    setEditingId("");
    setForm(emptyAsset);
    setError("");
  }


  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");


    try {
      if (editingId) {
        await api.patch(`/assets/${editingId}`, form);
        setMessage("Asset updated successfully");
      } else {
        await api.post("/assets", form);
        setMessage("Asset added successfully. Students can now select it.");
      }
      cancelEdit();
      await loadAssets();
    } catch (requestError) {
      setError(getMessage(requestError, "Failed to save asset"));
    } finally {
      setSaving(false);
    }
  }


  async function deleteAsset(id) {
    if (!window.confirm("Delete this asset? Existing requests will keep their record but no longer show asset details.")) return;


    setError("");
    setMessage("");
    try {
      await api.delete(`/assets/${id}`);
      setMessage("Asset deleted successfully");
      await loadAssets();
    } catch (requestError) {
      setError(getMessage(requestError, "Failed to delete asset"));
    }
  }


  return (
    <div>
      <div className="page-header"><div><p className="eyebrow">Inventory</p><h1>Manage Assets</h1><p className="subtitle">Add and maintain the room items students can select when reporting an issue.</p></div><span className="page-date">{assets.length} assets</span></div>


      <form className="form-card" onSubmit={handleSubmit}>
        <div className="form-grid"><div className="form-field"><label htmlFor="asset-name">Asset name</label><input id="asset-name" className="form-control" name="name" value={form.name} onChange={updateField} placeholder="e.g. Ceiling fan" required /></div>
        <div className="form-field"><label htmlFor="asset-code">Asset code</label><input id="asset-code" className="form-control" name="assetCode" value={form.assetCode} onChange={updateField} placeholder="e.g. FAN-101" required /></div>
        <div className="form-field"><label htmlFor="asset-category">Category</label><input id="asset-category" className="form-control" name="category" value={form.category} onChange={updateField} placeholder="e.g. Electrical" required /></div>
        <div className="form-field"><label htmlFor="asset-hostel">Hostel</label><input id="asset-hostel" className="form-control" name="hostel" value={form.hostel} onChange={updateField} placeholder="Hostel name" required /></div>
        <div className="form-field"><label htmlFor="asset-room">Room</label><input id="asset-room" className="form-control" name="room" value={form.room} onChange={updateField} placeholder="Room number" required /></div>
        <div className="form-field"><label htmlFor="asset-condition">Condition</label><select id="asset-condition" className="form-control" name="condition" value={form.condition} onChange={updateField}>
          <option value="Good">Good</option>
          <option value="Damaged">Damaged</option>
          <option value="Needs Repair">Needs Repair</option>
        </select></div></div>
        <div><button className="button-primary" type="submit" disabled={saving}>{saving ? "Saving..." : editingId ? "Update Asset" : "Add Asset"}</button>{editingId && <button className="button-secondary" type="button" onClick={cancelEdit}>Cancel</button>}</div>
      </form>


      {error && <p role="alert">{error}</p>}
      {message && <p>{message}</p>}


      {loading ? <div className="loading-state">Loading assets...</div> : assets.length === 0 ? <div className="empty-state">No assets added yet.</div> : (
        <section className="panel" style={{ marginTop: "20px" }}><div className="table-wrap"><table className="data-table"><thead><tr><th>Asset</th><th>Category</th><th>Location</th><th>Condition</th><th>Actions</th></tr></thead><tbody>
          {assets.map((asset) => (
            <tr key={asset._id}><td><strong>{asset.name}</strong><small className="muted">{asset.assetCode}</small></td><td>{asset.category}</td><td>{asset.hostel}, Room {asset.room}</td><td><span className="status-badge status-success">{asset.condition}</span></td><td><button className="button-secondary" type="button" onClick={() => { setEditingId(asset._id); setForm({ name: asset.name, assetCode: asset.assetCode, category: asset.category, hostel: asset.hostel, room: asset.room, condition: asset.condition }); setMessage(""); }}>Edit</button> <button className="button-danger" type="button" onClick={() => deleteAsset(asset._id)}>Delete</button></td></tr>
          ))}
        </tbody></table></div></section>
      )}
    </div>
  );
}


export default ManageAssets;



