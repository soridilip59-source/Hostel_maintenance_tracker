import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import StatusBadge from "../../components/StatusBadge";
import UserAvatar from "../../components/UserAvatar";
import api from "../../services/api";

const getPlace = (location = "") => {
  const match = location.match(/^(Boys Hostel|Girls Hostel)\s*\|\s*Room\s*(\d+)$/i);
  return match ? { hostel: match[1], room: match[2] } : { hostel: "Hostel not specified", room: location.replace(/\D/g, "") || "—" };
};

function Requests() {
  const [params] = useSearchParams();
  const [requests, setRequests] = useState([]);
  const [query, setQuery] = useState(() => params.get("q") || "");
  const [status, setStatus] = useState("All");
  const [category, setCategory] = useState("All");
  const [hostel, setHostel] = useState("All");
  const [sort, setSort] = useState("Latest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/maintenance")
      .then((complaints) => setRequests(complaints.data?.data || []))
      .catch((requestError) => setError(requestError.response?.data?.message || "Unable to load complaints."))
      .finally(() => setLoading(false));
  }, []);

  const categories = [...new Set(requests.map((request) => request.category).filter(Boolean))];
  const filtered = useMemo(() => requests.filter((request) => {
    const place = getPlace(request.location);
    const text = `${request.title || ""} ${request.reportedBy?.name || ""} ${request.description || ""} ${request.category || ""} ${place.hostel} ${place.room}`.toLowerCase();
    return text.includes(query.toLowerCase()) && (status === "All" || request.status === status) && (category === "All" || request.category === category) && (hostel === "All" || place.hostel === hostel);
  }).sort((a, b) => sort === "Latest" ? new Date(b.createdAt) - new Date(a.createdAt) : new Date(a.createdAt) - new Date(b.createdAt)), [requests, query, status, category, hostel, sort]);

  return <><div className="page-header"><div><p className="eyebrow">Operations</p><h1>All Complaints</h1><p className="subtitle">Review the issue, student, room, and progress in one place.</p></div><span className="page-date">{requests.length} total complaints</span></div><section className="panel complaint-workspace"><div className="filter-row"><input className="search-field" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search complaints…" /><select className="filter-select" value={status} onChange={(event) => setStatus(event.target.value)}><option>All</option><option>Pending</option><option>In Process</option><option>Resolved</option><option>Rejected</option></select><select className="filter-select" value={hostel} onChange={(event) => setHostel(event.target.value)}><option>All</option><option>Boys Hostel</option><option>Girls Hostel</option></select><select className="filter-select" value={category} onChange={(event) => setCategory(event.target.value)}><option>All</option>{categories.map((item) => <option key={item}>{item}</option>)}</select><select className="filter-select" value={sort} onChange={(event) => setSort(event.target.value)}><option>Latest</option><option>Oldest</option></select></div>{loading ? <div className="loading-state">Loading complaints…</div> : error ? <div className="error-state">{error}</div> : filtered.length === 0 ? <div className="empty-state">No complaints match these filters.</div> : <div className="complaint-row-list">{filtered.map((request) => { const place = getPlace(request.location); return <article className="complaint-row" key={request._id}><div className="complaint-reporter"><UserAvatar user={request.reportedBy} size="sm" /><div><strong>{request.reportedBy?.name || "Student"}</strong><small>{request.reportedBy?.email || "Student account"}</small></div></div><div className="complaint-summary"><div><span className="hostel-badge">{place.hostel}</span><span className="category-badge">{request.category || "Other"}</span></div><strong>{request.title || `${request.category || "Maintenance"} issue`}</strong><p>{request.description}</p></div><div className="complaint-room"><span>Room</span><strong>{place.room}</strong></div><div className="complaint-state"><StatusBadge status={request.status} /><small>{new Date(request.createdAt).toLocaleString(undefined, { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</small></div><Link className="button-secondary row-action" aria-label={`View complaint from ${request.reportedBy?.name || "student"}`} to={`/admin/requests/${request._id}`}>View</Link></article>; })}</div>}</section></>;
}

export default Requests;
