import { useMemo, useState } from "react";

const initialAlerts = [
  {
    id: "ALT-001",
    title: "Temperature Spike Detected",
    description:
      "Container CMA-7732 has exceeded the recommended temperature threshold.",
    container: "CMA-7732",
    location: "Dubai Port",
    severity: "Critical",
    status: "Active",
    time: "32 min ago",
    temperature: "9.8°C",
    message:
      "The container temperature is above the configured safe operating range. Immediate monitoring is recommended.",
  },
  {
    id: "ALT-002",
    title: "Temperature Warning",
    description:
      "Container YML-9320 is approaching the maximum temperature threshold.",
    container: "YML-9320",
    location: "Jebel Ali",
    severity: "Medium",
    status: "Active",
    time: "11 min ago",
    temperature: "10.6°C",
    message:
      "Temperature readings indicate an abnormal increase. The shipment remains under active monitoring.",
  },
  {
    id: "ALT-003",
    title: "Location Update Delayed",
    description:
      "Location telemetry for container HLC-5512 has not been updated recently.",
    container: "HLC-5512",
    location: "Arabian Sea",
    severity: "Low",
    status: "Active",
    time: "47 min ago",
    temperature: "4.7°C",
    message:
      "The tracking service has not received a recent location update from the container.",
  },
  {
    id: "ALT-004",
    title: "Audit Verification Complete",
    description:
      "All recent ledger events passed integrity verification.",
    container: "MSC-2917",
    location: "Mumbai Port",
    severity: "Normal",
    status: "Resolved",
    time: "18 min ago",
    temperature: "5.1°C",
    message:
      "The latest audit events were successfully verified against the immutable ledger.",
  },
];

const severityIcon = {
  Critical: "!",
  Medium: "▲",
  Low: "•",
  Normal: "✓",
};

function AlertsPage({ onNavigate, onLogout }) {
  const [alerts, setAlerts] = useState(initialAlerts);
  const [search, setSearch] = useState("");
  const [selectedSeverity, setSelectedSeverity] = useState("All");
  const [selectedAlert, setSelectedAlert] = useState(null);

  const filteredAlerts = useMemo(() => {
    const value = search.toLowerCase().trim();

    return alerts.filter((alert) => {
      const matchesSearch =
        alert.id.toLowerCase().includes(value) ||
        alert.title.toLowerCase().includes(value) ||
        alert.container.toLowerCase().includes(value) ||
        alert.location.toLowerCase().includes(value);

      const matchesSeverity =
        selectedSeverity === "All" ||
        alert.severity === selectedSeverity;

      return matchesSearch && matchesSeverity;
    });
  }, [alerts, search, selectedSeverity]);

  const criticalCount = alerts.filter(
    (alert) =>
      alert.severity === "Critical" &&
      alert.status === "Active"
  ).length;

  const mediumCount = alerts.filter(
    (alert) =>
      alert.severity === "Medium" &&
      alert.status === "Active"
  ).length;

  const lowCount = alerts.filter(
    (alert) =>
      alert.severity === "Low" &&
      alert.status === "Active"
  ).length;

  const activeCount = alerts.filter(
    (alert) => alert.status === "Active"
  ).length;

  const resetFilters = () => {
    setSearch("");
    setSelectedSeverity("All");
  };

  const acknowledgeAlert = (id) => {
    setAlerts((current) =>
      current.map((alert) =>
        alert.id === id
          ? {
              ...alert,
              status: "Resolved",
            }
          : alert
      )
    );

    setSelectedAlert((current) =>
      current
        ? {
            ...current,
            status: "Resolved",
          }
        : null
    );
  };

  const removeAlert = (id) => {
    setAlerts((current) =>
      current.filter((alert) => alert.id !== id)
    );

    setSelectedAlert(null);
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

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside className="alerts-sidebar">

        {/* BRAND */}

        <div className="alerts-brand">

          <div className="alerts-brand-logo">
            AT
          </div>

          <div>
            <strong>
              AuditTrail
            </strong>

            <span>
              FORENSIC LEDGER
            </span>
          </div>

        </div>


        {/* MONITORING */}

        <div className="alerts-nav-title">
          MONITORING
        </div>


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
          <span>⚑</span>
          Locations
        </button>


        <button
          className="alerts-nav-item"
          onClick={() => onNavigate("analytics")}
        >
          <span>▥</span>
          Analytics
        </button>


        {/* SECURITY */}

        <div className="alerts-nav-title security-title">
          SECURITY
        </div>


        <button
          className="alerts-nav-item"
          onClick={() => onNavigate("audit")}
        >
          <span>◇</span>
          Audit Integrity
        </button>


        <button className="alerts-nav-item active">
          <span>!</span>
          Alerts

          {activeCount > 0 && (
            <span className="alerts-nav-count">
              {activeCount}
            </span>
          )}
        </button>


        {/* =================================================
            SIDEBAR BOTTOM
        ================================================= */}

        <div className="alerts-sidebar-bottom">

          {/* SYSTEM OPERATIONAL */}

          <div className="alerts-system-status">

            <span></span>

            <div>

              <strong>
                System Operational
              </strong>

              <small>
                All services running
              </small>

            </div>

          </div>


          {/* ADMIN */}

          <div className="alerts-admin-row">

            <div className="alerts-admin-avatar">
              A
            </div>


            <div className="alerts-admin-info">

              <strong>
                Admin
              </strong>

              <span>
                Administrator
              </span>

            </div>


            <button
              className="alerts-logout-icon"
              onClick={logout}
              title="Logout"
              aria-label="Logout"
            >
              ↪
            </button>

          </div>

        </div>

      </aside>


      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="alerts-main">

        {/* HEADER */}

        <header className="alerts-header">

          <div>

            <div className="alerts-eyebrow">
              SECURITY MONITORING
            </div>

            <h1>
              Alerts
            </h1>

            <p>
              Monitor shipment exceptions and security events
              across the forensic ledger.
            </p>

          </div>


          <div className="alerts-live">

            <span></span>

            LIVE MONITORING

          </div>

        </header>


        {/* =================================================
            SUMMARY
        ================================================= */}

        <section className="alerts-summary">

          <div className="alerts-summary-card">

            <div>

              <span>
                ACTIVE ALERTS
              </span>

              <strong>
                {activeCount}
              </strong>

            </div>

            <div className="alerts-summary-icon alert-total">
              !
            </div>

          </div>


          <div className="alerts-summary-card">

            <div>

              <span>
                CRITICAL
              </span>

              <strong>
                {criticalCount}
              </strong>

            </div>

            <div className="alerts-summary-icon alert-critical">
              !
            </div>

          </div>


          <div className="alerts-summary-card">

            <div>

              <span>
                MEDIUM
              </span>

              <strong>
                {mediumCount}
              </strong>

            </div>

            <div className="alerts-summary-icon alert-medium">
              ▲
            </div>

          </div>


          <div className="alerts-summary-card">

            <div>

              <span>
                LOW
              </span>

              <strong>
                {lowCount}
              </strong>

            </div>

            <div className="alerts-summary-icon alert-low">
              •
            </div>

          </div>

        </section>


        {/* =================================================
            SEARCH / FILTERS
        ================================================= */}

        <section className="alerts-controls">

          <div className="alerts-search">

            <span>
              ⌕
            </span>

            <input
              type="text"
              placeholder="Search alert, container or location..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>


          <div className="alerts-filters">

            {[
              "All",
              "Critical",
              "Medium",
              "Low",
              "Normal",
            ].map((severity) => (

              <button
                key={severity}
                className={
                  selectedSeverity === severity
                    ? "selected"
                    : ""
                }
                onClick={() =>
                  setSelectedSeverity(severity)
                }
              >
                {severity}
              </button>

            ))}

          </div>


          {(search || selectedSeverity !== "All") && (

            <button
              className="alerts-reset"
              onClick={resetFilters}
            >
              Reset
            </button>

          )}

        </section>


        {/* =================================================
            ALERT PANEL
        ================================================= */}

        <section className="alerts-panel">

          <div className="alerts-panel-header">

            <div>

              <span>
                SECURITY EVENTS
              </span>

              <h2>
                Alert Activity
              </h2>

            </div>

            <span>
              Showing {filteredAlerts.length} of {alerts.length}
            </span>

          </div>


          {/* ALERT LIST */}

          {filteredAlerts.length === 0 ? (

            <div className="alerts-empty">

              <div>
                ✓
              </div>

              <h3>
                No alerts found
              </h3>

              <p>
                Try changing your search or severity filter.
              </p>

              <button onClick={resetFilters}>
                Clear Filters
              </button>

            </div>

          ) : (

            <div className="alerts-list">

              {filteredAlerts.map((alert) => (

                <button
                  key={alert.id}
                  className={`alert-item ${
                    alert.status === "Resolved"
                      ? "alert-resolved"
                      : ""
                  }`}
                  onClick={() =>
                    setSelectedAlert(alert)
                  }
                >

                  {/* ICON */}

                  <div
                    className={`alert-severity-icon severity-${alert.severity.toLowerCase()}`}
                  >
                    {severityIcon[alert.severity]}
                  </div>


                  {/* CONTENT */}

                  <div className="alert-item-content">

                    <div className="alert-item-top">

                      <strong>
                        {alert.title}
                      </strong>

                      <span
                        className={`alert-severity severity-${alert.severity.toLowerCase()}`}
                      >
                        {alert.severity}
                      </span>

                    </div>


                    <p>
                      {alert.description}
                    </p>


                    <div className="alert-item-meta">

                      <span>
                        {alert.container}
                      </span>

                      <span>
                        •
                      </span>

                      <span>
                        {alert.location}
                      </span>

                      <span>
                        •
                      </span>

                      <span>
                        {alert.time}
                      </span>

                    </div>

                  </div>


                  {/* STATUS */}

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

                    <b>
                      →
                    </b>

                  </div>

                </button>

              ))}

            </div>

          )}

        </section>


        {/* FOOTER */}

        <div className="alerts-footer">

          <span>
            AuditTrail Security Monitor
          </span>

          <span>
            Last synchronization: just now
          </span>

        </div>

      </main>


      {/* =====================================================
          ALERT DETAILS MODAL
      ===================================================== */}

      {selectedAlert && (

        <div
          className="alert-modal-overlay"
          onClick={() =>
            setSelectedAlert(null)
          }
        >

          <div
            className="alert-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="alert-modal-header">

              <div>

                <span>
                  ALERT DETAILS
                </span>

                <h2>
                  {selectedAlert.title}
                </h2>

                <div className="alert-modal-id">
                  {selectedAlert.id}
                </div>

              </div>


              <button
                onClick={() =>
                  setSelectedAlert(null)
                }
              >
                ×
              </button>

            </div>


            {/* DETAILS */}

            <div className="alert-detail-grid">

              <div>

                <span>
                  SEVERITY
                </span>

                <strong>
                  {selectedAlert.severity}
                </strong>

              </div>


              <div>

                <span>
                  STATUS
                </span>

                <strong>
                  {selectedAlert.status}
                </strong>

              </div>


              <div>

                <span>
                  CONTAINER
                </span>

                <strong>
                  {selectedAlert.container}
                </strong>

              </div>


              <div>

                <span>
                  LOCATION
                </span>

                <strong>
                  {selectedAlert.location}
                </strong>

              </div>


              <div>

                <span>
                  TEMPERATURE
                </span>

                <strong>
                  {selectedAlert.temperature}
                </strong>

              </div>


              <div>

                <span>
                  DETECTED
                </span>

                <strong>
                  {selectedAlert.time}
                </strong>

              </div>

            </div>


            {/* MESSAGE */}

            <div className="alert-message-box">

              <span>
                EVENT DESCRIPTION
              </span>

              <p>
                {selectedAlert.message}
              </p>

            </div>


            {/* ACTIONS */}

            <div className="alert-modal-actions">

              {selectedAlert.status === "Active" && (

                <button
                  className="alert-acknowledge"
                  onClick={() =>
                    acknowledgeAlert(
                      selectedAlert.id
                    )
                  }
                >
                  Acknowledge Alert
                </button>

              )}


              <button
                className="alert-delete"
                onClick={() =>
                  removeAlert(selectedAlert.id)
                }
              >
                Remove Alert
              </button>

            </div>


            <button
              className="alert-modal-close"
              onClick={() =>
                setSelectedAlert(null)
              }
            >
              Close
            </button>

          </div>

        </div>

      )}

    </div>
  );
}

export default AlertsPage;