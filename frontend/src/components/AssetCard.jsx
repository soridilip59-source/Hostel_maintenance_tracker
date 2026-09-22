function AssetCard({ asset }) {
    const tone = asset.condition === "Good" ? "success" : asset.condition === "Damaged" ? "pending" : "progress";


    return (
        <article className="asset-card">
            <div className="asset-card-top">
                <div className="asset-icon">{asset.name?.charAt(0)?.toUpperCase() || "A"}</div>
                <span className={`status-badge status-${tone}`}>{asset.condition}</span>
            </div>
            <h3>{asset.name}</h3>
            <p className="muted">{asset.category} · {asset.assetCode}</p>
            <div className="asset-meta"><span>Hostel</span><strong>{asset.hostel}</strong></div>
            <div className="asset-meta"><span>Room</span><strong>{asset.room}</strong></div>
        </article>
    )
}


export default AssetCard;
