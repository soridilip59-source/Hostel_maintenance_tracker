import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import StatusBadge from "../../components/StatusBadge";
import api from "../../services/api";

const formatDate = (value) => value ? new Date(value).toLocaleDateString(undefined, { day: "2-digit", month: "short" }) : "-";
const formatRequestId = (index) => `MR-${String(index + 1).padStart(3, "0")}`;

function StatCard({ icon, label, value, trend }) {
  return <div className="stat-card"><div className="stat-icon">{icon}</div><h3>{label}</h3><strong>{value}</strong><span className="trend">{trend}</span></div>;
}

function AdminDashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    api.get("/maintenance").then((response) => setRequests(Array.isArray(response.data?.data) ? response.data.data : [])).catch((requestError) => setError(requestError.response?.data?.message || "Unable to load dashboard data.")).finally(() => setLoading(false));
  }, []);

  const counts = { total: requests.length, pending: requests.filter((item) => item.status === "Pending").length, progress: requests.filter((item) => item.status === "In Progress").length, resolved: requests.filter((item) => item.status === "Resolved").length };
  const share = (value) => counts.total ? `${Math.max(3, (value / counts.total) * 100)}` : "3";
  const dateLabel = new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" });

  return <>
    <div className="page-header"><div><p className="eyebrow">Home / Dashboard</p><h1>Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 18 ? "afternoon" : "evening"}, {user.name || "Admin"} 👋</h1><p className="subtitle">Here's what's happening in your hostel today.</p></div><span className="page-date">{dateLabel}</span></div>
    {error && <div className="alert error">{error}</div>}
    {loading ? <div className="loading-state">Loading dashboard data...</div> : <>
      <div className="stats-grid"><StatCard icon="◈" label="Total Requests" value={counts.total} trend="Live data" /><StatCard icon="◷" label="Pending" value={counts.pending} trend="Needs attention" /><StatCard icon="◒" label="In Progress" value={counts.progress} trend="Being handled" /><StatCard icon="✓" label="Resolved" value={counts.resolved} trend="Completed" /></div>
      <div className="content-grid"><section className="panel analytics"><div className="panel-heading"><h2>Maintenance Requests Overview</h2><span className="muted">All time</span></div><div className="bar-chart"><div className="bar-group"><div className="bar" style={{ height: `${Math.max(8, counts.total * 8)}px` }} /></div><div className="bar-group"><div className="bar pending" style={{ height: `${Math.max(8, counts.pending * 13)}px` }} /></div><div className="bar-group"><div className="bar progress" style={{ height: `${Math.max(8, counts.progress * 13)}px` }} /></div><div className="bar-group"><div className="bar resolved" style={{ height: `${Math.max(8, counts.resolved * 13)}px` }} /></div></div><div className="chart-legend"><span><i className="legend-dot" />Total</span><span><i className="legend-dot pending" />Pending</span><span><i className="legend-dot progress" />In Progress</span><span><i className="legend-dot resolved" />Resolved</span></div></section>
        <section className="panel breakdown"><div className="panel-heading"><h2>Request Status</h2></div><div className="donut-wrap"><div className="donut" style={{ "--pending": `${share(counts.pending)}%`, "--progress": `${Number(share(counts.pending)) + Number(share(counts.progress))}%` }} /><div className="donut-label"><strong>{counts.total}</strong><span>Total</span></div></div><div className="chart-legend"><span><i className="legend-dot pending" />{counts.pending} Pending</span><span><i className="legend-dot progress" />{counts.progress} Active</span><span><i className="legend-dot resolved" />{counts.resolved} Resolved</span></div></section></div>
      <div className="content-grid"><section className="panel"><div className="panel-heading"><h2>Recent Maintenance Requests</h2><Link className="panel-link" to="/admin/requests">View all →</Link></div>{requests.length === 0 ? <div className="empty-state">No maintenance requests yet.</div> : <div className="table-wrap"><table className="data-table"><thead><tr><th>Request</th><th>Asset</th><th>Student</th><th>Issue</th><th>Status</th><th>Date</th></tr></thead><tbody>{requests.slice(0, 5).map((request, index) => <tr key={request._id} onClick={() => navigate(`/admin/requests/${request._id}`)} style={{ cursor: "pointer" }}><td><strong>{formatRequestId(index)}</strong><small className="muted">Maintenance request</small></td><td>{request.assetId?.name || "Unknown asset"}</td><td>{request.reportedBy?.name || request.reportedBy?.email || "Student"}</td><td>{request.description?.slice(0, 25)}{request.description?.length > 25 ? "..." : ""}</td><td><StatusBadge status={request.status} /></td><td>{formatDate(request.createdAt)}</td></tr>)}</tbody></table></div>}</section><section className="panel"><div className="panel-heading"><h2>Quick Actions</h2></div><div className="action-list"><button className="action-button" onClick={() => navigate("/admin/assets")}><span>+</span>Add New Asset</button><button className="action-button" onClick={() => navigate("/admin/requests")}><span>≡</span>Review Requests</button><button className="action-button" onClick={() => navigate("/admin/assets")}><span>◎</span>Manage Users</button></div></section></div>
      </>}
  </>;
}

export default AdminDashboard;
