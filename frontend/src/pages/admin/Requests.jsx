import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import StatusBadge from "../../components/StatusBadge";
import api from "../../services/api";

function Requests() {
  const [requests, setRequests] = useState([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => { api.get("/maintenance").then((response) => setRequests(response.data?.data || [])).catch((requestError) => setError(requestError.response?.data?.message || "Unable to load maintenance requests.")).finally(() => setLoading(false)); }, []);
  const filtered = useMemo(() => requests.filter((request) => { const text = `${request.assetId?.name || ""} ${request.reportedBy?.name || ""} ${request.description || ""}`.toLowerCase(); return text.includes(query.toLowerCase()) && (status === "All" || request.status === status); }), [requests, query, status]);
  return <><div className="page-header"><div><p className="eyebrow">Operations</p><h1>Maintenance Requests</h1><p className="subtitle">Review, prioritize, and resolve issues reported by students.</p></div><span className="page-date">{requests.length} total requests</span></div><section className="panel"><div className="filter-row"><input className="search-field" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by asset, student, or issue..." /><select className="filter-select" value={status} onChange={(event) => setStatus(event.target.value)}><option>All</option><option>Pending</option><option>In Progress</option><option>Resolved</option></select></div>{loading ? <div className="loading-state">Loading maintenance requests...</div> : error ? <div className="error-state">{error}</div> : filtered.length === 0 ? <div className="empty-state">No requests match your filters.</div> : <div className="table-wrap"><table className="data-table"><thead><tr><th>Request</th><th>Asset</th><th>Student</th><th>Issue</th><th>Status</th><th>Date</th><th /></tr></thead><tbody>{filtered.map((request, index) => <tr key={request._id}><td><strong>MR-{String(index + 1).padStart(3, "0")}</strong><small className="muted">Maintenance request</small></td><td>{request.assetId?.name || "Unknown asset"}<small className="muted">{request.assetId?.assetCode}</small></td><td>{request.reportedBy?.name || request.reportedBy?.email || "Student"}<small className="muted">{request.reportedBy?.email}</small></td><td>{request.description}</td><td><StatusBadge status={request.status} /></td><td>{new Date(request.createdAt).toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" })}</td><td><Link className="button-secondary" to={`/admin/requests/${request._id}`}>View</Link></td></tr>)}</tbody></table></div>}</section></>;
}
export default Requests;
