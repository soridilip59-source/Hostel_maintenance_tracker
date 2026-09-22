import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import ImageModal from "../../components/ImageModal";
import StatusBadge from "../../components/StatusBadge";
import api from "../../services/api";

export default function MyRequests() {
  const [params] = useSearchParams();
  const [requests, setRequests] = useState([]);
  const [query, setQuery] = useState(() => params.get("q") || "");
  const [status, setStatus] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState("");

  useEffect(() => {
    api.get("/maintenance")
      .then(({ data }) => setRequests(data.data || []))
      .catch((err) => setError(err.response?.data?.message || "Unable to load your complaints."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(
    () => requests.filter((request) => `${request.title || ""} ${request.category || ""} ${request.description || ""} ${request.location || ""}`.toLowerCase().includes(query.toLowerCase()) && (status === "All" || request.status === status)),
    [requests, query, status]
  );

  return (
    <>
      <div className="page-header">
        <div>
          <p className="eyebrow">Your activity</p>
          <h1>My Complaints</h1>
          <p className="subtitle">Track every issue you have reported and its progress.</p>
        </div>
        <Link className="button-primary" to="/student/report">+ Report an issue</Link>
      </div>

      <section className="panel">
        <div className="filter-row">
          <input className="search-field" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search your complaints…" />
          <select className="filter-select" value={status} onChange={(event) => setStatus(event.target.value)}>
            <option>All</option>
            <option>Pending</option>
            <option>In Process</option>
            <option>Resolved</option>
            <option>Rejected</option>
          </select>
        </div>

        {loading ? (
          <div className="loading-state">Loading your complaints…</div>
        ) : error ? (
          <div className="error-state">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">No complaints match your filters.</div>
        ) : (
          <div className="complaint-list">
            {filtered.map((request) => (
              <article className="complaint-card" key={request._id}>
                <div className="complaint-card-main">
                  {request.image && (
                    <button className="complaint-thumb" type="button" onClick={() => setPreview(request.image)}>
                      <img src={request.image} alt={`Attachment for ${request.title}`} />
                    </button>
                  )}

                  <div>
                    <div className="complaint-title">
                      <h3>{request.title || request.assetId?.name || "Maintenance request"}</h3>
                      <StatusBadge status={request.status} />
                    </div>
                    <p>{request.description}</p>
                    <div className="complaint-meta">
                      <span>{request.category || "Other"}</span>
                      <span>Room {request.location || "Not provided"}</span>
                      <span>Reported {new Date(request.createdAt).toLocaleString(undefined, { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                    </div>
                  </div>
                </div>

                <div className="complaint-card-actions">
                  <Link className="button-secondary" to={`/student/requests/${request._id}`}>View</Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {preview && <ImageModal src={preview} alt="Complaint attachment" onClose={() => setPreview("")} />}
    </>
  );
}
