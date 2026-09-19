 
function StatusBadge({status}) {
  const colors = {
    Pending: "status-badge--pending",
    "In Progress": "status-badge--in-progress",
    Resolved: "status-badge--resolved",
  };

  return (
    <span className={`status-badge ${colors[status] || "status-badge--default"}`}>{status}</span>
  )
}

export default StatusBadge
