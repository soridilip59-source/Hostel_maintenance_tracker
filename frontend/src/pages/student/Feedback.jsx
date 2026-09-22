import { useEffect, useState } from "react";
import { notify } from "../../components/NotificationCenter";
import UserAvatar from "../../components/UserAvatar";
import api from "../../services/api";
import { FEEDBACK_CATEGORIES } from "../../constants/feedback";

const initialForm = { type: FEEDBACK_CATEGORIES[0], rating: 5, message: "" };

export default function Feedback() {
  const isAdmin = localStorage.getItem("role") === "admin";
  const [form, setForm] = useState(initialForm);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const load = async () => {
    try {
      const { data } = await api.get("/feedback");
      setItems(data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load feedback.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (event) => {
    event.preventDefault();

    if (form.message.trim().length < 10) {
      setError("Please share at least 10 characters of feedback.");
      notify({ type: "warning", message: "Please share at least 10 characters of feedback." });
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");
    notify({ type: "info", message: "Submitting feedback..." });

    try {
      await api.post("/feedback", form);
      setForm(initialForm);
      setMessage("Feedback submitted successfully.");
      notify({ type: "success", message: "Feedback submitted successfully." });
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to submit feedback. Please try again.");
      notify({ type: "error", message: "Unable to submit feedback. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="page-header">
        <div>
          <p className="eyebrow">Your voice</p>
          <h1>Feedback</h1>
          <p className="subtitle">Help us make hostel living better for everyone.</p>
        </div>
      </div>

      <div className="content-grid feedback-layout">
        <section className="form-card">
          <h2>Share feedback</h2>
          <p className="muted">Let us know what is working well and what needs improvement.</p>

          {error && <div className="alert error">{error}</div>}
          {message && <div className="alert success">{message}</div>}

          <form onSubmit={submit}>
            <div className="form-field">
              <label htmlFor="feedback-type">What is your feedback about?</label>
              <select id="feedback-type" className="form-control" value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })}>
                {FEEDBACK_CATEGORIES.map((type) => <option key={type}>{type}</option>)}
              </select>
            </div>

            <fieldset className="rating-field">
              <legend>Rating</legend>
              <div className="rating-options">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <label key={rating} className="rating-option">
                    <input type="radio" name="rating" value={rating} checked={form.rating === rating} onChange={() => setForm({ ...form, rating })} />
                    <span aria-hidden="true">★</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="form-field">
              <label htmlFor="feedback-message">Feedback message</label>
              <textarea id="feedback-message" className="form-control" value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} placeholder="Tell us what is working well or what we can improve…" maxLength="2000" required />
            </div>

            <button className="button-primary" disabled={saving}>{saving ? "Submitting..." : "Submit feedback"}</button>
          </form>
        </section>

        <section className="panel">
          <div className="panel-heading">
            <h2>{isAdmin ? "All feedback" : "Your recent feedback"}</h2>
          </div>

          {loading ? (
            <div className="loading-state">Loading feedback…</div>
          ) : items.length === 0 ? (
            <div className="empty-state">No feedback has been submitted yet.</div>
          ) : (
            <div className="feedback-list">
              {items.slice(0, 5).map((item) => (
                <article className="feedback-item" key={item._id || item.createdAt}>
                  <div className="feedback-head">
                    <div className="feedback-person"><UserAvatar user={item.submittedBy} size="sm" /><div><strong>{item.submittedBy?.name || "User"}</strong><small>{new Date(item.createdAt).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}</small></div></div>
                    <span className="feedback-rating" aria-label={`${item.rating || 0} out of 5 stars`}>{Array.from({ length: item.rating || 0 }).map(() => "★").join("")}</span>
                  </div>
                  <span className="category-badge">{item.type || "Feedback"}</span>
                  <p>{item.message}</p>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
