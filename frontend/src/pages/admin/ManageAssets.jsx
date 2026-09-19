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
    <div className="manage-assets">
      <h1>Manage Assets</h1>
      <p className="page-description">Add the room items students can select when reporting an issue.</p>

      <form className="asset-form" onSubmit={handleSubmit}>
        <input name="name" value={form.name} onChange={updateField} placeholder="Asset name" required />
        <input name="assetCode" value={form.assetCode} onChange={updateField} placeholder="Asset code" required />
        <input name="category" value={form.category} onChange={updateField} placeholder="Category" required />
        <input name="hostel" value={form.hostel} onChange={updateField} placeholder="Hostel" required />
        <input name="room" value={form.room} onChange={updateField} placeholder="Room" required />
        <select name="condition" value={form.condition} onChange={updateField}>
          <option value="Good">Good</option>
          <option value="Damaged">Damaged</option>
          <option value="Needs Repair">Needs Repair</option>
        </select>
        <button className="primary-button" type="submit" disabled={saving}>{saving ? "Saving..." : editingId ? "Update Asset" : "Add Asset"}</button>
        {editingId && <button className="secondary-button" type="button" onClick={cancelEdit}>Cancel</button>}
      </form>

      {error && <p className="feedback feedback--error" role="alert">{error}</p>}
      {message && <p className="feedback feedback--success">{message}</p>}

      {loading ? <p>Loading assets...</p> : assets.length === 0 ? <p>No assets added yet.</p> : (
        <ul className="asset-list">
          {assets.map((asset) => (
            <li key={asset._id}>
              <span><strong>{asset.name}</strong> ({asset.assetCode}) — {asset.hostel}, Room {asset.room} — {asset.condition}</span>
              <span className="asset-actions"><button className="edit-button" type="button" onClick={() => { setEditingId(asset._id); setForm({ name: asset.name, assetCode: asset.assetCode, category: asset.category, hostel: asset.hostel, room: asset.room, condition: asset.condition }); setMessage(""); }}>Edit</button>
              <button className="delete-button" type="button" onClick={() => deleteAsset(asset._id)}>Delete</button></span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ManageAssets;
