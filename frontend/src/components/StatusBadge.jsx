 
function StatusBadge({status}) {
<<<<<<< HEAD
  const colors = {
    Pending: "status-badge--pending",
    "In Progress": "status-badge--in-progress",
    Resolved: "status-badge--resolved",
  };

  return (
    <span className={`status-badge ${colors[status] || "status-badge--default"}`}>{status}</span>
  )
=======
  const tone = status === "Resolved" ? "success" : status === "In Progress" ? "progress" : "pending";

  return <span className={`status-badge status-${tone}`}>{status || "Pending"}</span>;
>>>>>>> 3ceaf172be1721b9777bbb9ad6c949d1f2a2c8d6
}

export default StatusBadge
