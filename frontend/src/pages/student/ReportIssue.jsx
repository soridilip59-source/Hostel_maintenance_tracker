import { useState } from "react";
import { notify } from "../../components/NotificationCenter";
import { FEEDBACK_CATEGORIES, HOSTELS } from "../../constants/feedback";
import api from "../../services/api";

const initialForm = { hostel: HOSTELS[0], roomNumber: "", category: FEEDBACK_CATEGORIES[0], description: "" };

export default function ReportIssue() {
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const update = ({ target: { name, value } }) => setForm((current) => ({ ...current, [name]: name === "roomNumber" ? value.replace(/\D/g, "") : value }));

  const submit = async (event) => {
    event.preventDefault();
    if (!form.roomNumber || !form.description.trim()) {
      const message = "Please enter your room number and describe the issue.";
      setError(message);
      notify({ type: "warning", message });
      return;
    }
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await api.post("/maintenance", form);
      const message = "Issue reported successfully. The maintenance team has been notified.";
      setSuccess(message);
      notify({ type: "success", message: "Issue reported successfully." });
      setForm(initialForm);
    } catch (requestError) {
      const message = requestError.response?.data?.message || "Unable to submit the issue. Please try again.";
      setError(message);
      notify({ type: "error", message });
    } finally {
      setSaving(false);
    }
  };

  return <><div className="page-header"><div><p className="eyebrow">Maintenance support</p><h1>Report an Issue</h1><p className="subtitle">Share the essentials and we’ll route your request to the right team.</p></div></div><section className="form-card report-issue-card"><div className="report-issue-intro"><span className="report-issue-icon" aria-hidden="true">⚡</span><div><h2>Tell us what happened</h2><p className="muted">Reports are automatically recorded with the date and time.</p></div></div>{error && <div className="alert error" role="alert">{error}</div>}{success && <div className="alert success" role="status">{success}</div>}<form className="report-issue-form" onSubmit={submit}><div className="report-field-row"><div className="form-field"><label htmlFor="hostel">Hostel</label><select id="hostel" name="hostel" className="form-control" value={form.hostel} onChange={update}>{HOSTELS.map((hostel) => <option key={hostel}>{hostel}</option>)}</select></div><div className="form-field"><label htmlFor="roomNumber">Room number</label><input id="roomNumber" name="roomNumber" className="form-control" inputMode="numeric" pattern="[0-9]*" value={form.roomNumber} onChange={update} placeholder="e.g. 204" required /></div></div><div className="form-field"><label htmlFor="category">What is your feedback about?</label><select id="category" name="category" className="form-control" value={form.category} onChange={update}>{FEEDBACK_CATEGORIES.map((category) => <option key={category}>{category}</option>)}</select></div><div className="form-field"><label htmlFor="description">Issue details</label><textarea id="description" name="description" className="form-control" value={form.description} onChange={update} placeholder="Briefly describe the problem, including anything that may help the team resolve it." maxLength="2000" required /></div><button type="submit" className="button-primary report-submit" disabled={saving}>{saving ? "Sending report…" : "Submit issue report"}</button></form></section></>;
}
