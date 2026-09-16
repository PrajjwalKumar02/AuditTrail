import { useMemo, useState } from "react";

const containers = [
  {
    id: "ATL-4821",
    status: "In Transit",
    location: "Singapore Port",
    temperature: 4.2,
    shipment: "SHIP-10482",
    updated: "4 min ago",
  },
  {
    id: "MSC-2917",
    status: "At Warehouse",
    location: "Mumbai Port",
    temperature: 5.1,
    shipment: "SHIP-20891",
    updated: "18 min ago",
  },
  {
    id: "CMA-7732",
    status: "Alert",
    location: "Dubai Port",
    temperature: 9.8,
    shipment: "SHIP-31942",
    updated: "32 min ago",
  },
  {
    id: "MAE-1048",
    status: "Delivered",
    location: "Rotterdam Port",
    temperature: 3.9,
    shipment: "SHIP-42107",
    updated: "1 hr ago",
  },
  {
    id: "HLC-5512",
    status: "In Transit",
    location: "Arabian Sea",
    temperature: 4.7,
    shipment: "SHIP-53122",
    updated: "7 min ago",
  },
  {
    id: "ONE-8821",
    status: "At Warehouse",
    location: "Mumbai Warehouse",
    temperature: 5.4,
    shipment: "SHIP-61290",
    updated: "24 min ago",
  },
  {
    id: "COS-4410",
    status: "Delivered",
    location: "Rotterdam",
    temperature: 4.1,
    shipment: "SHIP-70421",
    updated: "2 hr ago",
  },
  {
    id: "YML-9320",
    status: "Alert",
    location: "Jebel Ali",
    temperature: 10.6,
    shipment: "SHIP-81932",
    updated: "11 min ago",
  },
];

const statusInfo = {
  "In Transit": {
    icon: "🚢",
    className: "analytics-status-transit",
  },
  "At Warehouse": {
    icon: "🏭",
    className: "analytics-status-warehouse",
  },
  Delivered: {
    icon: "✓",
    className: "analytics-status-delivered",
  },
  Alert: {
    icon: "⚠",
    className: "analytics-status-alert",
  },
};

function AnalyticsPage({ onNavigate, onLogout }) {
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedContainer, setSelectedContainer] = useState(null);

  const filteredContainers = useMemo(() => {
    return containers.filter((container) => {
      const matchesSearch =
        container.id.toLowerCase().includes(search.toLowerCase()) ||
        container.location.toLowerCase().includes(search.toLowerCase()) ||
        container.shipment.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        selectedStatus === "All" || container.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [search, selectedStatus]);

  const total = containers.length;

  const statusCounts = {
    "In Transit": containers.filter((c) => c.status === "In Transit").length,
    "At Warehouse": containers.filter((c) => c.status === "At Warehouse").length,
    Delivered: containers.filter((c) => c.status === "Delivered").length,
    Alert: containers.filter((c) => c.status === "Alert").length,
  };

  const averageTemperature =
    containers.reduce((sum, c) => sum + c.temperature, 0) / total;

  const alertPercentage = Math.round(
    (statusCounts.Alert / total) * 100
  );

  const deliveryPercentage = Math.round(
    (statusCounts.Delivered / total) * 100
  );

  const locations = [...new Set(containers.map((c) => c.location))];

  const handleStatusClick = (status) => {
    setSelectedStatus((current) =>
      current === status ? "All" : status
    );
  };

  const handleReset = () => {
    setSearch("");
    setSelectedStatus("All");
  };

  const logout = () => {
    localStorage.removeItem("audittrail_auth");
    localStorage.removeItem("audittrail_logged_in");

    if (onLogout) {
      onLogout();
    }
  };

  return (
    <div className="analytics-page">
      {/* SIDEBAR */}
      <aside className="analytics-sidebar">
        <div className="analytics-brand">
          <div className="analytics-brand-logo">AT</div>

          <div>
            <strong>AuditTrail</strong>
            <span>FORENSIC LEDGER</span>
          </div>
        </div>

        <div className="analytics-nav-title">MONITORING</div>

        <button
          className="analytics-nav-item"
          onClick={() => onNavigate("dashboard")}
        >
          <span>⌂</span>
          Dashboard
        </button>

        <button
          className="analytics-nav-item"
          onClick={() => onNavigate("containers")}
        >
          <span>▣</span>
          Containers
        </button>

        <button
          className="analytics-nav-item"
          onClick={() => onNavigate("timeline")}
        >
          <span>◷</span>
          Event Timeline
        </button>

        <button
          className="analytics-nav-item"
          onClick={() => onNavigate("locations")}
        >
          <span>⌖</span>
          Locations
        </button>

        <button className="analytics-nav-item active">
          <span>▥</span>
          Analytics
        </button>

        <div className="analytics-nav-title">SECURITY</div>

        <button
          className="analytics-nav-item"
          onClick={() => onNavigate("audit")}
        >
          <span>✓</span>
          Audit Integrity
        </button>

        <button
          className="analytics-nav-item"
          onClick={() => onNavigate("alerts")}
        >
          <span>⚠</span>
          Alerts
        </button>

        <div className="analytics-sidebar-bottom">
          <div className="analytics-system-status">
            <span></span>
            All systems operational
          </div>

          <button className="analytics-logout" onClick={logout}>
            ⇥ Logout
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="analytics-main">
        {/* HEADER */}
        <header className="analytics-header">
          <div>
            <div className="analytics-eyebrow">
              AUDIT INTELLIGENCE
            </div>

            <h1>Analytics</h1>

            <p>
              Monitor shipment activity, container health and
              forensic audit metrics.
            </p>
          </div>

          <div className="analytics-header-right">
            <div className="analytics-live">
              <span></span>
              LIVE DATA
            </div>

            <div className="analytics-time">
              Updated just now
            </div>
          </div>
        </header>

        {/* KPI CARDS */}
        <section className="analytics-kpi-grid">
          <div className="analytics-kpi-card">
            <div className="analytics-kpi-top">
              <span>Total Containers</span>
              <b>▣</b>
            </div>

            <strong>{total}</strong>

            <div className="analytics-kpi-footer">
              <span className="analytics-positive">↑ 12.4%</span>
              <span>vs last period</span>
            </div>
          </div>

          <div className="analytics-kpi-card">
            <div className="analytics-kpi-top">
              <span>Verified Events</span>
              <b>✓</b>
            </div>

            <strong>5,421</strong>

            <div className="analytics-kpi-footer">
              <span className="analytics-positive">↑ 8.7%</span>
              <span>verified successfully</span>
            </div>
          </div>

          <div className="analytics-kpi-card">
            <div className="analytics-kpi-top">
              <span>Integrity Score</span>
              <b>◇</b>
            </div>

            <strong>99.8%</strong>

            <div className="analytics-kpi-footer">
              <span className="analytics-positive">Stable</span>
              <span>hash verification</span>
            </div>
          </div>

          <div className="analytics-kpi-card">
            <div className="analytics-kpi-top">
              <span>Active Alerts</span>
              <b>⚠</b>
            </div>

            <strong>{statusCounts.Alert}</strong>

            <div className="analytics-kpi-footer">
              <span className="analytics-warning">
                {alertPercentage}%
              </span>
              <span>of monitored containers</span>
            </div>
          </div>
        </section>

        {/* CONTROLS */}
        <section className="analytics-controls">
          <div className="analytics-search">
            <span>⌕</span>

            <input
              type="text"
              placeholder="Search container, shipment or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="analytics-filters">
            {[
              "All",
              "In Transit",
              "At Warehouse",
              "Delivered",
              "Alert",
            ].map((status) => (
              <button
                key={status}
                className={
                  selectedStatus === status
                    ? "selected"
                    : ""
                }
                onClick={() => setSelectedStatus(status)}
              >
                {status}
              </button>
            ))}
          </div>

          {(search || selectedStatus !== "All") && (
            <button
              className="analytics-reset"
              onClick={handleReset}
            >
              Reset
            </button>
          )}
        </section>

        {/* ANALYTICS GRID */}
        <section className="analytics-grid">
          {/* STATUS DISTRIBUTION */}
          <div className="analytics-panel">
            <div className="analytics-panel-header">
              <div>
                <span className="analytics-panel-label">
                  CONTAINER STATUS
                </span>
                <h2>Status Distribution</h2>
              </div>

              <span className="analytics-panel-count">
                {total} total
              </span>
            </div>

            <div className="analytics-status-list">
              {Object.entries(statusCounts).map(
                ([status, count]) => {
                  const percentage = Math.round(
                    (count / total) * 100
                  );

                  return (
                    <button
                      key={status}
                      className={`analytics-status-row ${
                        selectedStatus === status
                          ? "row-selected"
                          : ""
                      }`}
                      onClick={() =>
                        handleStatusClick(status)
                      }
                    >
                      <div
                        className={`analytics-status-icon ${statusInfo[status].className}`}
                      >
                        {statusInfo[status].icon}
                      </div>

                      <div className="analytics-status-info">
                        <div>
                          <strong>{status}</strong>
                          <span>{count} containers</span>
                        </div>

                        <div className="analytics-progress">
                          <span
                            style={{
                              width: `${percentage}%`,
                            }}
                          ></span>
                        </div>
                      </div>

                      <b>{percentage}%</b>
                    </button>
                  );
                }
              )}
            </div>
          </div>

          {/* HEALTH */}
          <div className="analytics-panel">
            <div className="analytics-panel-header">
              <div>
                <span className="analytics-panel-label">
                  ENVIRONMENT
                </span>
                <h2>Shipment Health</h2>
              </div>
            </div>

            <div className="analytics-health">
              <div className="health-circle">
                <div>
                  <strong>{averageTemperature.toFixed(1)}°</strong>
                  <span>AVG TEMP</span>
                </div>
              </div>

              <div className="health-metrics">
                <div>
                  <span>Temperature alerts</span>
                  <strong>{statusCounts.Alert}</strong>
                </div>

                <div>
                  <span>Within threshold</span>
                  <strong>{100 - alertPercentage}%</strong>
                </div>

                <div>
                  <span>Delivered</span>
                  <strong>{deliveryPercentage}%</strong>
                </div>
              </div>
            </div>
          </div>

          {/* LOCATIONS */}
          <div className="analytics-panel">
            <div className="analytics-panel-header">
              <div>
                <span className="analytics-panel-label">
                  GLOBAL COVERAGE
                </span>
                <h2>Tracked Locations</h2>
              </div>

              <span className="analytics-panel-count">
                {locations.length}
              </span>
            </div>

            <div className="analytics-location-list">
              {locations.map((location) => {
                const count = containers.filter(
                  (c) => c.location === location
                ).length;

                return (
                  <div
                    className="analytics-location-row"
                    key={location}
                  >
                    <div className="location-dot"></div>

                    <div>
                      <strong>{location}</strong>
                      <span>{count} tracked</span>
                    </div>

                    <b>→</b>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AUDIT */}
          <div className="analytics-panel analytics-audit-panel">
            <div className="analytics-panel-header">
              <div>
                <span className="analytics-panel-label">
                  FORENSIC AUDIT
                </span>
                <h2>Audit Activity</h2>
              </div>

              <span className="audit-verified-badge">
                VERIFIED
              </span>
            </div>

            <div className="audit-big-number">
              5,421
            </div>

            <p>
              Events successfully verified against the
              immutable audit ledger.
            </p>

            <div className="audit-mini-grid">
              <div>
                <span>Hash Checks</span>
                <strong>12,842</strong>
              </div>

              <div>
                <span>Tampered</span>
                <strong>0</strong>
              </div>

              <div>
                <span>Integrity</span>
                <strong>99.8%</strong>
              </div>

              <div>
                <span>Verified</span>
                <strong>100%</strong>
              </div>
            </div>

            <button
              className="audit-view-button"
              onClick={() => onNavigate("audit")}
            >
              View Audit Integrity →
            </button>
          </div>
        </section>

        {/* CONTAINER TABLE */}
        <section className="analytics-table-panel">
          <div className="analytics-panel-header">
            <div>
              <span className="analytics-panel-label">
                LIVE MONITORING
              </span>
              <h2>Container Activity</h2>
            </div>

            <span className="analytics-results">
              Showing {filteredContainers.length} of {total}
            </span>
          </div>

          {filteredContainers.length === 0 ? (
            <div className="analytics-empty">
              <div>⌕</div>
              <h3>No containers found</h3>
              <p>
                Try changing your search or status filter.
              </p>

              <button onClick={handleReset}>
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="analytics-table-wrap">
              <table className="analytics-table">
                <thead>
                  <tr>
                    <th>CONTAINER</th>
                    <th>SHIPMENT</th>
                    <th>LOCATION</th>
                    <th>TEMPERATURE</th>
                    <th>STATUS</th>
                    <th>UPDATED</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredContainers.map((container) => (
                    <tr
                      key={container.id}
                      onClick={() =>
                        setSelectedContainer(container)
                      }
                    >
                      <td>
                        <strong>{container.id}</strong>
                      </td>

                      <td>{container.shipment}</td>

                      <td>{container.location}</td>

                      <td>
                        <span
                          className={
                            container.temperature > 8
                              ? "temperature-warning"
                              : "temperature-normal"
                          }
                        >
                          {container.temperature}°C
                        </span>
                      </td>

                      <td>
                        <span
                          className={`analytics-table-status status-${container.status
                            .toLowerCase()
                            .replaceAll(" ", "-")}`}
                        >
                          <i></i>
                          {container.status}
                        </span>
                      </td>

                      <td>{container.updated}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      {/* DETAILS MODAL */}
      {selectedContainer && (
        <div
          className="analytics-modal-overlay"
          onClick={() => setSelectedContainer(null)}
        >
          <div
            className="analytics-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="analytics-modal-header">
              <div>
                <span>CONTAINER DETAILS</span>
                <h2>{selectedContainer.id}</h2>
              </div>

              <button
                onClick={() => setSelectedContainer(null)}
              >
                ×
              </button>
            </div>

            <div className="analytics-modal-grid">
              <div>
                <span>Shipment</span>
                <strong>{selectedContainer.shipment}</strong>
              </div>

              <div>
                <span>Status</span>
                <strong>{selectedContainer.status}</strong>
              </div>

              <div>
                <span>Location</span>
                <strong>{selectedContainer.location}</strong>
              </div>

              <div>
                <span>Temperature</span>
                <strong>{selectedContainer.temperature}°C</strong>
              </div>

              <div>
                <span>Last Update</span>
                <strong>{selectedContainer.updated}</strong>
              </div>

              <div>
                <span>Audit State</span>
                <strong>Verified</strong>
              </div>
            </div>

            <button
              className="analytics-modal-close"
              onClick={() => setSelectedContainer(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AnalyticsPage;