
function AssetCard({ asset }) {
    return (
        <div>
            <h3>{asset.name}</h3>
            <p>Asset Code: {asset.assetCode}</p>
            <p>Hostel: {asset.hostel}</p>
            <p>Room: {asset.room}</p>
            <p>Condition: {asset.condition}</p>

        </div>
    )
}

export default AssetCard;