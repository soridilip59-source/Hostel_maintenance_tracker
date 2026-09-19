import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StatusBadge from "../../components/StatusBadge";
import api from "../../services/api";

function StatCard({ icon, label, value, tone = "blue" }) {
  return <div className={`stat-card stat-${tone}`}><div className="stat-icon">{icon}</div><h3>{label}</h3><strong>{value}</strong></div>;
}

function StudentDashboard() {
  const [assets, setAssets] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    Promise.all([api.get("/assets"), api.get("/maintenance")])
      .then(([assetsResponse, requestsResponse]) => {
        setAssets(assetsResponse.data?.data || []);
        setRequests(requestsResponse.data?.data || []);
      })
      .catch((requestError) => setError(requestError.response?.data?.message || "Unable to load your dashboard."))
      .finally(() => setLoading(false));
  }, []);

  const pending = requests.filter((request) => request.status === "Pending").length;
  const inProgress = requests.filter((request) => request.status === "In Progress").length;
  const resolved = requests.filter((request) => request.status === "Resolved").length;

  if (loading) return <div className="loading-state">Loading your dashboard...</div>;

  return <>
    <div className="page-header"><div><p className="eyebrow">Student workspace</p><h1>Welcome, {user.name || "Student"}</h1><p className="subtitle">Here's a clear overview of your room and maintenance requests.</p></div><Link className="button-primary" to="/student/report">+ Report an issue</Link></div>
    {error && <div className="alert error">{error}</div>}
    <div className="stats-grid"><StatCard icon="▣" label="Room Assets" value={assets.length} /><StatCard icon="◷" label="Pending" value={pending} tone="pending" /><StatCard icon="◒" label="In Progress" value={inProgress} tone="progress" /><StatCard icon="✓" label="Resolved" value={resolved} tone="resolved" /></div>
    <div className="content-grid"><section className="panel"><div className="panel-heading"><div><h2>Recent requests</h2><p className="muted">Your latest maintenance activity</p></div><Link className="panel-link" to="/student/requests">View all →</Link></div>{requests.length === 0 ? <div className="empty-state">You have not submitted a request yet.</div> : <div className="table-wrap"><table className="data-table"><thead><tr><th>Asset</th><th>Issue</th><th>Status</th><th>Date</th></tr></thead><tbody>{requests.slice(0, 5).map((request) => <tr key={request._id}><td><strong>{request.assetId?.name || "Asset"}</strong><small className="muted">{request.assetId?.assetCode || ""}</small></td><td>{request.description}</td><td><StatusBadge status={request.status} /></td><td>{new Date(request.createdAt).toLocaleDateString(undefined, { day: "2-digit", month: "short" })}</td></tr>)}</tbody></table></div>}</section><section className="panel quick-panel"><div className="panel-heading"><div><h2>What would you like to do?</h2><p className="muted">Common actions are one click away</p></div></div><div className="action-list"><Link className="action-button" to="/student/report"><span>+</span><div><strong>Report an issue</strong><small>Tell maintenance what needs attention</small></div></Link><Link className="action-button" to="/student/assets"><span>▣</span><div><strong>View room assets</strong><small>Browse items assigned to your room</small></div></Link><Link className="action-button" to="/student/requests"><span>≡</span><div><strong>Track my requests</strong><small>Check status and resolution updates</small></div></Link></div></section></div>
  </>;
}

export default StudentDashboard;
