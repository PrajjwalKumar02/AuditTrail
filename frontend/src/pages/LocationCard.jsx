function LocationCard({ container }) {
  return (
    <div className="card">
      <div className="card-icon">📍</div>

      <div>
        <p className="card-label">Current Location</p>
        <h3>{container.location}</h3>
        <p>Last updated: {container.lastUpdated}</p>
      </div>
    </div>
  );
}

export default LocationCard;