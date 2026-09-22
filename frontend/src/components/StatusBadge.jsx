function StatusBadge({status}) {
  const tone = status === "Resolved" ? "success" : status === "Rejected" ? "rejected" : (status === "In Progress" || status === "In Process") ? "progress" : "pending";
  const label = status === "In Process" ? "In Progress" : status || "Pending";
  const icon = tone === "success" ? "✓" : tone === "progress" ? "⚙" : tone === "rejected" ? "×" : "◷";

  return <span className={`status-badge status-${tone}`}><span aria-hidden="true">{icon}</span>{label}</span>;
}


export default StatusBadge
