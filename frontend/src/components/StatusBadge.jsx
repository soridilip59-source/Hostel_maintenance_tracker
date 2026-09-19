 
function StatusBadge({status}) {
  const tone = status === "Resolved" ? "success" : status === "In Progress" ? "progress" : "pending";

  return <span className={`status-badge status-${tone}`}>{status || "Pending"}</span>;
}

export default StatusBadge