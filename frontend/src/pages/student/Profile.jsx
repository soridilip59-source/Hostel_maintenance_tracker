import { useState } from "react";
import UserAvatar, { displayName } from "../../components/UserAvatar";
import api from "../../services/api";

export default function Profile() {
  const stored = JSON.parse(localStorage.getItem("user") || "{}");
  const [form, setForm] = useState({
    name: stored.name || "",
    email: stored.email || "",
    phone: stored.phone || "",
    hostel: stored.hostel || "",
    room: stored.room || "",
    role: stored.role || "student"
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const { data } = await api.put("/auth/me", { name: form.name, email: form.email });
      localStorage.setItem("user", JSON.stringify({ ...stored, ...data.data }));
      setMessage("Profile updated successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="page-header">
        <div>
          <p className="eyebrow">Account</p>
          <h1>Profile</h1>
          <p className="subtitle">Keep your contact details accurate for maintenance updates.</p>
        </div>
      </div>

      <section className="profile-card panel">
        <div className="profile-hero">
          <UserAvatar user={stored} size="lg" className="profile-avatar" alt={displayName(stored)} />
          <div>
            <h2>{form.name || "Student"}</h2>
            <p className="muted">{form.role === "admin" ? "Administrator" : "Student account"}</p>
          </div>
        </div>

        {error && <div className="alert error">{error}</div>}
        {message && <div className="alert success">{message}</div>}

        <div className="profile-grid">
          <div className="profile-summary">
            <div className="info-row"><span>Name</span><strong>{form.name || "Not available"}</strong></div>
            <div className="info-row"><span>Email</span><strong>{form.email || "Not available"}</strong></div>
            <div className="info-row"><span>Phone</span><strong>{form.phone || "Not available"}</strong></div>
            <div className="info-row"><span>Hostel</span><strong>{form.hostel || "Not available"}</strong></div>
            <div className="info-row"><span>Room</span><strong>{form.room || "Not available"}</strong></div>
            <div className="info-row"><span>Role</span><strong>{form.role === "admin" ? "Administrator" : "Student"}</strong></div>
          </div>

          <form onSubmit={submit} className="form-grid profile-form-grid">
            <div className="form-field">
              <label htmlFor="profile-name">Full name</label>
              <input id="profile-name" className="form-control" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
            </div>
            <div className="form-field">
              <label htmlFor="profile-email">Email address</label>
              <input id="profile-email" className="form-control" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
            </div>
            <div className="form-field">
              <label htmlFor="profile-phone">Phone</label>
              <input id="profile-phone" className="form-control" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} placeholder="Optional" />
            </div>
            <div className="form-field">
              <label htmlFor="profile-hostel">Hostel</label>
              <input id="profile-hostel" className="form-control" value={form.hostel} onChange={(event) => setForm({ ...form, hostel: event.target.value })} placeholder="Optional" />
            </div>
            <div className="form-field">
              <label htmlFor="profile-room">Room</label>
              <input id="profile-room" className="form-control" value={form.room} onChange={(event) => setForm({ ...form, room: event.target.value })} placeholder="Optional" />
            </div>
            <div className="form-field">
              <label htmlFor="profile-role">Role</label>
              <input id="profile-role" className="form-control" value={form.role === "admin" ? "Administrator" : "Student"} disabled />
            </div>
            <div className="form-field full">
              <button className="button-primary" disabled={saving}>{saving ? "Saving..." : "Save profile"}</button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
