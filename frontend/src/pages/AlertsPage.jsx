import { useMemo, useState } from "react";

const initialAlerts = [
  {
    id: "ALT-001",
    container: "CMA-7732",
    type: "Temperature Spike",
    severity: "Critical",
    location: "Dubai Port",
    temperature: "9.8°C",
    message:
      "Container temperature has exceeded the configured safe threshold.",
    time: "2 min ago",
    status: "Active",
  },
  {
    id: "ALT-002",
    container: "MSC-2917",
    type: "Port Delay",
    severity: "Low",
    location: "Mumbai Port",
    temperature: "5.1°C",
    message:
      "Shipment has remained at the current location longer than expected.",
    time: "8 min ago",
    status: "Active",
  },
  {
    id: "ALT-003",
    container: "CTN-73510",
    type: "Document Verification",
    severity: "Medium",
    location: "Singapore Port",
    temperature: "4.4°C",
    message:
      "Required shipment documentation is waiting for verification.",
    time: "15 min ago",
    status: "Active",
  },
  {
    id: "ALT-004",
    container: "ATL-4821",
    type: "Location Update",
    severity: "Normal",
    location: "Singapore Port",
    temperature: "4.2°C",
    message:
      "Container location was successfully updated and verified.",
    time: "21 min ago",
    status: "Resolved",
  },
];

function AlertsPage({ onNavigate, onLogout }) {
  const [alerts, setAlerts] = useState(initialAlerts);
  const [search, setSearch] = useState("");
  const [severity, setSeverity] = useState("All");
  const [selectedAlert, setSelectedAlert] = useState(null);

  const activeAlerts = alerts.filter(
    (alert) => alert.status === "Active"
  );

  const criticalCount = alerts.filter(
    (alert) => alert.severity === "Critical" && alert.status === "Active"
  ).length;

  const mediumCount = alerts.filter(
    (alert) => alert.severity === "Medium" && alert.status === "Active"
  ).length;

  const lowCount = alerts.filter(
    (alert) => alert.severity === "Low" && alert.status === "Active"
  ).length;

  const filteredAlerts = useMemo(() => {
    return alerts.filter((alert) => {
      const query = search.toLowerCase();

      const matchesSearch =
        alert.id.toLowerCase().includes(query) ||
        alert.container.toLowerCase().includes(query) ||
        alert.type.toLowerCase().includes(query) ||
        alert.location.toLowerCase().includes(query);

      const matchesSeverity =
        severity === "All" || alert.severity === severity;

      return matchesSearch && matchesSeverity;
    });
  }, [alerts, search, severity]);

  const acknowledgeAlert = (id) => {
    setAlerts((current) =>
      current.map((alert) =>
        alert.id === id
          ? { ...alert, status: "Resolved" }
          : alert
      )
    );

    setSelectedAlert(null);
  };

  const deleteAlert = (id) => {
    setAlerts((current) =>
      current.filter((alert) => alert.id !== id)
    );

    setSelectedAlert(null);
  };

  const resetFilters = () => {
    setSearch("");
    setSeverity("All");
  };

  const logout = () => {
    localStorage.removeItem("audittrail_auth");
    localStorage.removeItem("audittrail_logged_in");

    if (onLogout) {
      onLogout();
    }
  };

  return (
    <div className="alerts-page">
      {/* SIDEBAR */}
      <aside className="alerts-sidebar">
        <div className="alerts-brand">
          <div className="alerts-brand-logo">AT</div>

          <div>
            <strong>AuditTrail</strong>
            <span>FORENSIC LEDGER</span>
          </div>
        </div>

        <div className="alerts-nav-title">MONITORING</div>

        <button
          className="alerts-nav-item"
          onClick={() => onNavigate("dashboard")}
        >
          <span>⌂</span>
          Dashboard
        </button>

        <button
          className="alerts-nav-item"
          onClick={() => onNavigate("containers")}
        >
          <span>▣</span>
          Containers
        </button>

        <button
          className="alerts-nav-item"
          onClick={() => onNavigate("timeline")}
        >
          <span>◷</span>
          Event Timeline
        </button>

        <button
          className="alerts-nav-item"
          onClick={() => onNavigate("locations")}
        >
          <span>⌖</span>
          Locations
        </button>

        <button
          className="alerts-nav-item"
          onClick={() => onNavigate("analytics")}
        >
          <span>▥</span>
          Analytics
        </button>

        <div className="alerts-nav-title">SECURITY</div>

        <button
          className="alerts-nav-item"
          onClick={() => onNavigate("audit")}
        >
          <span>✓</span>
          Audit Integrity
        </button>

        <button className="alerts-nav-item active">
          <span>⚠</span>
          Alerts

          {activeAlerts.length > 0 && (
            <b className="alerts-nav-count">
              {activeAlerts.length}
            </b>
          )}
        </button>

        <div className="alerts-sidebar-bottom">
          <div className="alerts-system-status">
            <span></span>
            <div>
              <strong>System Operational</strong>
              <small>All services running</small>
            </div>
          </div>

          <div className="alerts-admin-row">
            <div className="alerts-admin-avatar">A</div>

            <div className="alerts-admin-info">
              <strong>Admin</strong>
              <span>Administrator</span>
            </div>

            <button
              className="alerts-logout-icon"
              onClick={logout}
              title="Logout"
            >
              ↪
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="alerts-main">
        {/* HEADER */}
        <header className="alerts-header">
          <div>
            <div className="alerts-eyebrow">
              SECURITY MONITORING
            </div>

            <h1>Alerts</h1>

            <p>
              Monitor, investigate and acknowledge shipment
              anomalies.
            </p>
          </div>

          <div className="alerts-live">
            <span></span>
            LIVE MONITORING
          </div>
        </header>

        {/* SUMMARY */}
        <section className="alerts-summary">
          <div className="alerts-summary-card">
            <div>
              <span>ACTIVE ALERTS</span>
              <strong>{activeAlerts.length}</strong>
            </div>

            <div className="alerts-summary-icon alert-total">
              ⚠
            </div>
          </div>

          <div className="alerts-summary-card">
            <div>
              <span>CRITICAL</span>
              <strong>{criticalCount}</strong>
            </div>

            <div className="alerts-summary-icon alert-critical">
              !
            </div>
          </div>

          <div className="alerts-summary-card">
            <div>
              <span>MEDIUM</span>
              <strong>{mediumCount}</strong>
            </div>

            <div className="alerts-summary-icon alert-medium">
              !
            </div>
          </div>

          <div className="alerts-summary-card">
            <div>
              <span>LOW</span>
              <strong>{lowCount}</strong>
            </div>

            <div className="alerts-summary-icon alert-low">
              i
            </div>
          </div>
        </section>

        {/* CONTROLS */}
        <section className="alerts-controls">
          <div className="alerts-search">
            <span>⌕</span>

            <input
              type="text"
              placeholder="Search alerts, containers or locations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="alerts-filters">
            {["All", "Critical", "Medium", "Low", "Normal"].map(
              (item) => (
                <button
                  key={item}
                  className={
                    severity === item ? "selected" : ""
                  }
                  onClick={() => setSeverity(item)}
                >
                  {item}
                </button>
              )
            )}
          </div>

          {(search || severity !== "All") && (
            <button
              className="alerts-reset"
              onClick={resetFilters}
            >
              Reset
            </button>
          )}
        </section>

        {/* ALERT LIST */}
        <section className="alerts-panel">
          <div className="alerts-panel-header">
            <div>
              <span>FORENSIC EVENT MONITOR</span>
              <h2>Alert Stream</h2>
            </div>

            <span>
              {filteredAlerts.length} alerts
            </span>
          </div>

          {filteredAlerts.length === 0 ? (
            <div className="alerts-empty">
              <div>✓</div>

              <h3>No alerts found</h3>

              <p>
                There are no alerts matching your current
                filters.
              </p>

              <button onClick={resetFilters}>
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="alerts-list">
              {filteredAlerts.map((alert) => (
                <button
                  className={`alert-item ${
                    alert.status === "Resolved"
                      ? "alert-resolved"
                      : ""
                  }`}
                  key={alert.id}
                  onClick={() => setSelectedAlert(alert)}
                >
                  <div
                    className={`alert-severity-icon severity-${alert.severity.toLowerCase()}`}
                  >
                    {alert.severity === "Critical"
                      ? "!"
                      : alert.severity === "Medium"
                      ? "!"
                      : alert.severity === "Low"
                      ? "i"
                      : "✓"}
                  </div>

                  <div className="alert-item-content">
                    <div className="alert-item-top">
                      <strong>{alert.type}</strong>

                      <span
                        className={`alert-severity severity-${alert.severity.toLowerCase()}`}
                      >
                        {alert.severity}
                      </span>
                    </div>

                    <p>{alert.message}</p>

                    <div className="alert-item-meta">
                      <span>{alert.container}</span>
                      <span>•</span>
                      <span>{alert.location}</span>
                      <span>•</span>
                      <span>{alert.time}</span>
                    </div>
                  </div>

                  <div className="alert-item-status">
                    <span
                      className={
                        alert.status === "Active"
                          ? "status-active"
                          : "status-resolved"
                      }
                    >
                      {alert.status}
                    </span>

                    <b>→</b>
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>

        {/* FOOTER */}
        <div className="alerts-footer">
          <span>
            Monitoring {alerts.length} total alert records
          </span>

          <span>
            Last synchronized just now
          </span>
        </div>
      </main>

      {/* MODAL */}
      {selectedAlert && (
        <div
          className="alert-modal-overlay"
          onClick={() => setSelectedAlert(null)}
        >
          <div
            className="alert-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="alert-modal-header">
              <div>
                <span>ALERT DETAILS</span>
                <h2>{selectedAlert.type}</h2>
              </div>

              <button
                onClick={() => setSelectedAlert(null)}
              >
                ×
              </button>
            </div>

            <div className="alert-modal-id">
              {selectedAlert.id}
            </div>

            <div className="alert-detail-grid">
              <div>
                <span>Container</span>
                <strong>{selectedAlert.container}</strong>
              </div>

              <div>
                <span>Severity</span>
                <strong>{selectedAlert.severity}</strong>
              </div>

              <div>
                <span>Location</span>
                <strong>{selectedAlert.location}</strong>
              </div>

              <div>
                <span>Temperature</span>
                <strong>{selectedAlert.temperature}</strong>
              </div>

              <div>
                <span>Detected</span>
                <strong>{selectedAlert.time}</strong>
              </div>

              <div>
                <span>Status</span>
                <strong>{selectedAlert.status}</strong>
              </div>
            </div>

            <div className="alert-message-box">
              <span>DESCRIPTION</span>
              <p>{selectedAlert.message}</p>
            </div>

            {selectedAlert.status === "Active" ? (
              <div className="alert-modal-actions">
                <button
                  className="alert-acknowledge"
                  onClick={() =>
                    acknowledgeAlert(selectedAlert.id)
                  }
                >
                  ✓ Acknowledge Alert
                </button>

                <button
                  className="alert-delete"
                  onClick={() =>
                    deleteAlert(selectedAlert.id)
                  }
                >
                  Remove
                </button>
              </div>
            ) : (
              <button
                className="alert-modal-close"
                onClick={() => setSelectedAlert(null)}
              >
                Close
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AlertsPage;