import { useState } from "react";

function LocationCard({ location }) {
  const [showDetails, setShowDetails] = useState(false);

  const statusClass =
    location.status === "In Transit"
      ? "location-status-transit"
      : location.status === "At Warehouse"
      ? "location-status-warehouse"
      : location.status === "Delivered"
      ? "location-status-delivered"
      : "location-status-alert";

  return (
    <>
      <div
        className="location-working-card"
        onClick={() => setShowDetails(true)}
      >
        <div className="location-card-left">
          <div className="location-card-icon">📍</div>

          <div>
            <p className="location-card-label">{location.container}</p>

            <h3>{location.location}</h3>

            <p className="location-updated">
              Last updated {location.updated}
            </p>
          </div>
        </div>

        <div className="location-card-right">
          <span className={`location-operational ${statusClass}`}>
            {location.status}
          </span>

          <span className="location-temperature">
            {location.temperature}
          </span>

          <button
            className="location-view"
            onClick={(e) => {
              e.stopPropagation();
              setShowDetails(true);
            }}
          >
            View Details →
          </button>
        </div>
      </div>

      {showDetails && (
        <div
          className="location-details-overlay"
          onClick={() => setShowDetails(false)}
        >
          <div
            className="location-details"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="location-details-header">
              <div>
                <span className="location-details-label">
                  CONTAINER LOCATION
                </span>

                <h2>{location.container}</h2>
              </div>

              <button
                className="location-details-close"
                onClick={() => setShowDetails(false)}
              >
                ×
              </button>
            </div>

            <div className="location-details-status">
              <span className={statusClass}>{location.status}</span>
            </div>

            <div className="location-details-grid">
              <div className="location-detail-item">
                <span>Current Location</span>
                <strong>{location.location}</strong>
              </div>

              <div className="location-detail-item">
                <span>Temperature</span>
                <strong>{location.temperature}</strong>
              </div>

              <div className="location-detail-item">
                <span>Latitude</span>
                <strong>{location.latitude}</strong>
              </div>

              <div className="location-detail-item">
                <span>Longitude</span>
                <strong>{location.longitude}</strong>
              </div>

              <div className="location-detail-item">
                <span>Last Updated</span>
                <strong>{location.updated}</strong>
              </div>

              <div className="location-detail-item">
                <span>Shipment</span>
                <strong>{location.shipment}</strong>
              </div>
            </div>

            <div className="location-details-footer">
              <div>
                <span>Tracking Status</span>
                <strong>✓ Location verified</strong>
              </div>

              <button
                className="location-close-button"
                onClick={() => setShowDetails(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default LocationCard;