import React, { useState } from "react";

function LocationCard({ container }) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <>
      {/* LOCATION CARD */}
      <div
        className="location-working-card"
        onClick={() => setShowDetails(true)}
      >
        <div className="location-card-left">
          <div className="location-card-icon">📍</div>

          <div>
            <p className="location-card-label">CURRENT LOCATION</p>
            <h3>{container.location}</h3>

            <p className="location-updated">
              Last updated: {container.lastUpdated || "Just now"}
            </p>
          </div>
        </div>

        <div className="location-card-right">
          <span className="location-operational">
            <span></span>
            Operational
          </span>

          <span className="location-view">
            View details →
          </span>
        </div>
      </div>

      {/* DETAILS POPUP */}
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
                <span>LOCATION DETAILS</span>
                <h2>{container.location}</h2>
                <p>Live container monitoring</p>
              </div>

              <button onClick={() => setShowDetails(false)}>
                ×
              </button>
            </div>

            <div className="location-live">
              <span></span>
              LOCATION OPERATIONAL
            </div>

            <div className="location-detail-grid">
              <div>
                <small>CONTAINERS</small>
                <strong>{container.containers || "128"}</strong>
              </div>

              <div>
                <small>ACTIVE SHIPMENTS</small>
                <strong>{container.shipments || "34"}</strong>
              </div>

              <div>
                <small>TEMPERATURE</small>
                <strong>{container.temperature || "5.2°C"}</strong>
              </div>

              <div>
                <small>LAST UPDATE</small>
                <strong>{container.lastUpdated || "Just now"}</strong>
              </div>
            </div>

            <div className="location-coordinates">
              <span>📍 CURRENT COORDINATES</span>
              <strong>
                {container.coordinates || "18.9388° N, 72.8354° E"}
              </strong>
            </div>

            <div className="location-activity">
              <div className="activity-title">
                <h3>Recent Activity</h3>
                <span>LIVE</span>
              </div>

              <div className="location-activity-item">
                <i></i>
                <div>
                  <strong>Container movement detected</strong>
                  <p>Shipment activity recorded</p>
                </div>
                <small>2m</small>
              </div>

              <div className="location-activity-item">
                <i></i>
                <div>
                  <strong>Location verified</strong>
                  <p>Integrity check completed</p>
                </div>
                <small>8m</small>
              </div>

              <div className="location-activity-item">
                <i></i>
                <div>
                  <strong>Shipment synchronized</strong>
                  <p>Latest container data received</p>
                </div>
                <small>14m</small>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default LocationCard;