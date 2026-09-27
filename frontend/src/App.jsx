import { useState } from "react";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ContainersPage from "./pages/ContainersPage";
import EventTimeline from "./pages/EventTimeline";
import AnalyticsPage from "./pages/AnalyticsPage";
import AlertsPage from "./pages/AlertsPage";
import ShipmentMap from "./components/map/ShipmentMap";
import AIInsightsPage from "./pages/AIInsightsPage";

/* =====================================================
   SHARED SIDEBAR
===================================================== */

function AppSidebar({ activePage, onNavigate, onLogout }) {
  return (
    <aside className="audit-sidebar">

      <div className="audit-brand">
        <div className="audit-brand-logo">
          AT
        </div>

        <div>
          <h2>AuditTrail</h2>
          <span>FORENSIC LEDGER</span>
        </div>
      </div>

      <div className="sidebar-label">
        WORKSPACE
      </div>

      <nav className="audit-nav">

        <button
          className={`nav-link ${
            activePage === "dashboard" ? "active" : ""
          }`}
          onClick={() => onNavigate("dashboard")}
        >
          <span>◇</span>
          Dashboard
        </button>

        <button
          className={`nav-link ${
            activePage === "containers" ? "active" : ""
          }`}
          onClick={() => onNavigate("containers")}
        >
          <span>▣</span>
          Containers
        </button>

        <button
          className={`nav-link ${
            activePage === "timeline" ? "active" : ""
          }`}
          onClick={() => onNavigate("timeline")}
        >
          <span>◷</span>
          Event Timeline
        </button>

        <button
          className={`nav-link ${
            activePage === "locations" ? "active" : ""
          }`}
          onClick={() => onNavigate("locations")}
        >
          <span>⚑</span>
          Locations
        </button>

        <button
          className={`nav-link ${
            activePage === "analytics" ? "active" : ""
          }`}
          onClick={() => onNavigate("analytics")}
        >
          <span>▥</span>
          Analytics
        </button>

        <div className="sidebar-label security-label">
          SECURITY
        </div>

        <button
          className={`nav-link ${
            activePage === "audit" ? "active" : ""
          }`}
          onClick={() => onNavigate("audit")}
        >
          <span>◇</span>
          Audit Integrity
        </button>

        <button
          className={`nav-link ${
            activePage === "alerts" ? "active" : ""
          }`}
          onClick={() => onNavigate("alerts")}
        >
          <span>!</span>
          Alerts
        </button>

      </nav>

      <div className="sidebar-bottom">

        <div className="system-status">

          <span className="status-dot"></span>

          <div>
            <strong>
              System Operational
            </strong>

            <small>
              All services running
            </small>
          </div>

        </div>

        <div className="sidebar-user">

          <div className="user-avatar">
            A
          </div>

          <div className="user-info">
            <strong>Admin</strong>
            <span>Administrator</span>
          </div>

          <button
            className="logout-button"
            onClick={onLogout}
            title="Logout"
          >
            ↪
          </button>

        </div>

      </div>

    </aside>
  );
}


/* =====================================================
   LOCATIONS PAGE
===================================================== */

function LocationsPage({
  onNavigate,
  onLogout,
}) {

  const locations = [
    {
      id: "ATL-4821",
      shipment: "SHIP-10482",
      location: "Singapore Port",
      country: "Singapore",
      status: "In Transit",
      temperature: "4.2°C",
      updated: "4 min ago",
      latitude: 1.2644,
      longitude: 103.8222,
      coordinates: "1.2644° N, 103.8222° E",
      route: "Singapore → Mumbai",
      progress: 42,
    },

    {
      id: "MSC-2917",
      shipment: "SHIP-20891",
      location: "Mumbai Port",
      country: "India",
      status: "At Warehouse",
      temperature: "5.1°C",
      updated: "18 min ago",
      latitude: 18.949,
      longitude: 72.952,
      coordinates: "18.9490° N, 72.9520° E",
      route: "Mumbai → Dubai",
      progress: 68,
    },

    {
      id: "CMA-7732",
      shipment: "SHIP-31942",
      location: "Dubai Port",
      country: "UAE",
      status: "Alert",
      temperature: "9.8°C",
      updated: "32 min ago",
      latitude: 25.2769,
      longitude: 55.282,
      coordinates: "25.2769° N, 55.2820° E",
      route: "Dubai → Rotterdam",
      progress: 74,
    },

    {
      id: "MAE-1048",
      shipment: "SHIP-42107",
      location: "Rotterdam Port",
      country: "Netherlands",
      status: "Delivered",
      temperature: "3.9°C",
      updated: "1 hr ago",
      latitude: 51.9244,
      longitude: 4.4777,
      coordinates: "51.9244° N, 4.4777° E",
      route: "Singapore → Rotterdam",
      progress: 100,
    },
  ];

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedLocation, setSelectedLocation] =
    useState(null);

  const filteredLocations =
    locations.filter((location) => {

      const value =
        search.toLowerCase().trim();

      const matchesSearch =
        location.id
          .toLowerCase()
          .includes(value) ||
        location.location
          .toLowerCase()
          .includes(value) ||
        location.country
          .toLowerCase()
          .includes(value) ||
        location.status
          .toLowerCase()
          .includes(value);

      const matchesFilter =
        filter === "All" ||
        location.status === filter;

      return matchesSearch && matchesFilter;
    });


  const statusClass = (status) => {

    if (status === "Alert") {
      return "map-status-alert";
    }

    if (status === "Delivered") {
      return "map-status-delivered";
    }

    if (status === "At Warehouse") {
      return "map-status-warehouse";
    }

    return "map-status-transit";
  };


  const total = locations.length;

  const transitCount =
    locations.filter(
      (x) => x.status === "In Transit"
    ).length;

  const warehouseCount =
    locations.filter(
      (x) => x.status === "At Warehouse"
    ).length;

  const alertCount =
    locations.filter(
      (x) => x.status === "Alert"
    ).length;


  return (
    <div className="audit-app">

      <AppSidebar
        activePage="locations"
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

      <main className="audit-main">

        <div className="audit-content locations-map-page">

          {/* ================= HEADER ================= */}

          <div className="locations-map-header">

            <div>

              <p className="eyebrow">
                AUDITTRAIL / LIVE TRACKING
              </p>

              <h1>
                Shipment Locations
              </h1>

              <p>
                Real-time geographic tracking of
                audited containers.
              </p>

            </div>

            <div className="locations-live-badge">
              <span></span>
              LIVE TRACKING
            </div>

          </div>


          {/* ================= CONTROLS ================= */}

          <div className="locations-map-controls">

            <div className="locations-map-search">

              <span>⌕</span>

              <input
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search container, port or country..."
              />

              {search && (
                <button
                  onClick={() => setSearch("")}
                >
                  ×
                </button>
              )}

            </div>


            <div className="locations-map-filters">

              {[
                "All",
                "In Transit",
                "At Warehouse",
                "Delivered",
                "Alert",
              ].map((item) => (

                <button
                  key={item}
                  className={
                    filter === item
                      ? "map-filter active"
                      : "map-filter"
                  }
                  onClick={() =>
                    setFilter(item)
                  }
                >
                  {item}
                </button>

              ))}

            </div>

          </div>


          {/* ================= MAIN MAP AREA ================= */}

          <div className="locations-map-layout">

            {/* MAP */}

            <div className="locations-map-panel">

              <div className="locations-map-panel-header">

                <div>
                  <span>GLOBAL SHIPMENT MAP</span>

                  <h2>
                    Live Container Network
                  </h2>
                </div>

                <div className="map-record-count">
                  {filteredLocations.length} tracked
                </div>

              </div>


              <div className="locations-map-container">

                <ShipmentMap
                  locations={filteredLocations}
                  selectedLocation={selectedLocation}
                  onSelectLocation={
                    setSelectedLocation
                  }
                />

              </div>


              {/* MAP LEGEND */}

              <div className="locations-map-legend">

                <div>
                  <span className="legend-dot transit"></span>
                  In Transit
                </div>

                <div>
                  <span className="legend-dot warehouse"></span>
                  Warehouse
                </div>

                <div>
                  <span className="legend-dot delivered"></span>
                  Delivered
                </div>

                <div>
                  <span className="legend-dot alert"></span>
                  Alert
                </div>

              </div>

            </div>


            {/* RIGHT LIST */}

            <div className="locations-live-panel">

              <div className="locations-live-header">

                <div>
                  <span>TRACKING FEED</span>

                  <h2>
                    Live Locations
                  </h2>
                </div>

                <div className="verified-badge">
                  ✓ Verified
                </div>

              </div>


              <div className="locations-live-list">

                {filteredLocations.length === 0 ? (

                  <div className="map-empty">

                    <div>⌕</div>

                    <strong>
                      No locations found
                    </strong>

                    <p>
                      Try another search or filter.
                    </p>

                    <button
                      onClick={() => {
                        setSearch("");
                        setFilter("All");
                      }}
                    >
                      Clear Filters
                    </button>

                  </div>

                ) : (

                  filteredLocations.map(
                    (location) => (

                      <button
                        key={location.id}
                        className={`live-location-item ${
                          selectedLocation?.id ===
                          location.id
                            ? "selected"
                            : ""
                        }`}
                        onClick={() =>
                          setSelectedLocation(
                            location
                          )
                        }
                      >

                        <div className="live-location-marker">
                          <span></span>
                        </div>


                        <div className="live-location-info">

                          <div className="live-location-top">

                            <strong>
                              {location.id}
                            </strong>

                            <span
                              className={`map-status ${statusClass(
                                location.status
                              )}`}
                            >
                              {location.status}
                            </span>

                          </div>

                          <h3>
                            {location.location}
                          </h3>

                          <p>
                            {location.route}
                          </p>


                          <div className="live-location-meta">

                            <span>
                              🌡 {location.temperature}
                            </span>

                            <span>
                              {location.updated}
                            </span>

                          </div>


                          <div className="location-progress">

                            <div>
                              <span>
                                Shipment progress
                              </span>

                              <b>
                                {location.progress}%
                              </b>
                            </div>

                            <div className="location-progress-track">
                              <span
                                style={{
                                  width: `${location.progress}%`,
                                }}
                              ></span>
                            </div>

                          </div>

                        </div>

                        <span className="location-arrow">
                          →
                        </span>

                      </button>

                    )
                  )

                )}

              </div>

            </div>

          </div>


          {/* ================= BOTTOM STATS ================= */}

          <div className="locations-bottom-stats">

            <div className="location-bottom-stat">

              <div className="bottom-stat-icon">
                ◉
              </div>

              <div>
                <span>TRACKED</span>
                <strong>{total}</strong>
              </div>

            </div>


            <div className="location-bottom-stat">

              <div className="bottom-stat-icon transit-icon">
                ↗
              </div>

              <div>
                <span>MOVING</span>
                <strong>{transitCount}</strong>
              </div>

            </div>


            <div className="location-bottom-stat">

              <div className="bottom-stat-icon warehouse-icon">
                ▣
              </div>

              <div>
                <span>WAREHOUSE</span>
                <strong>{warehouseCount}</strong>
              </div>

            </div>


            <div className="location-bottom-stat">

              <div className="bottom-stat-icon alert-icon">
                !
              </div>

              <div>
                <span>ALERTS</span>
                <strong>{alertCount}</strong>
              </div>

            </div>


            <div className="location-bottom-stat">

              <div className="bottom-stat-icon verified-icon">
                ✓
              </div>

              <div>
                <span>VERIFIED</span>
                <strong>100%</strong>
              </div>

            </div>

          </div>


          {/* ================= SELECTED LOCATION ================= */}

          {selectedLocation && (

            <div className="location-focus-bar">

              <div>

                <span>
                  SELECTED CONTAINER
                </span>

                <strong>
                  {selectedLocation.id}
                </strong>

                <small>
                  {selectedLocation.location}
                  {" • "}
                  {selectedLocation.coordinates}
                </small>

              </div>

              <button
                onClick={() =>
                  setSelectedLocation(null)
                }
              >
                Clear Selection ×
              </button>

            </div>

          )}

        </div>

      </main>

    </div>
  );
}


/* =====================================================
   AUDIT INTEGRITY
===================================================== */

function AuditIntegrity({
  onNavigate,
  onLogout,
}) {

  const [verifying, setVerifying] =
    useState(false);

  const [progress, setProgress] =
    useState(100);

  const runVerification = () => {

    setVerifying(true);
    setProgress(0);

    let value = 0;

    const interval = setInterval(() => {

      value += 10;
      setProgress(value);

      if (value >= 100) {

        clearInterval(interval);

        setTimeout(() => {
          setVerifying(false);
        }, 500);

      }

    }, 150);
  };


  const checks = [
    [
      "Ledger Chain Verification",
      "Complete event chain validated",
      "Just now",
    ],
    [
      "Hash Integrity Check",
      "Stored hashes successfully matched",
      "2 min ago",
    ],
    [
      "Event Sequence Validation",
      "Chronological event ordering verified",
      "5 min ago",
    ],
    [
      "Container Audit Validation",
      "Container audit records validated",
      "8 min ago",
    ],
  ];


  return (
    <div className="audit-app">

      <AppSidebar
        activePage="audit"
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

      <main className="audit-main">

        <div className="audit-content">

          <div className="page-heading">

            <div>

              <p className="eyebrow">
                AUDITTRAIL
              </p>

              <h1>
                Audit Integrity
              </h1>

              <p>
                Verify the integrity of your event-sourced ledger.
              </p>

            </div>

            <div className="dashboard-live">
              <span></span>
              LIVE
            </div>

          </div>


          <div className="panel integrity-working-panel">

            <div className="panel-header">

              <div>

                <h2>
                  Ledger Integrity
                </h2>

                <p>
                  Cryptographic verification of audit records
                </p>

              </div>

              <div className="panel-status">
                <span></span>
                ACTIVE
              </div>

            </div>


            <div className="integrity-working-content">

              <div
                className={`integrity-icon ${
                  verifying ? "checking" : ""
                }`}
              >
                {verifying ? "↻" : "✓"}
              </div>

              <h2>
                {verifying
                  ? "Verifying Ledger..."
                  : "Ledger Verified"}
              </h2>

              <p>
                {verifying
                  ? "Checking hashes, records and event sequences"
                  : "All audit records passed integrity verification."}
              </p>

              {verifying && (
                <>
                  <div className="integrity-progress">
                    <div
                      style={{
                        width: `${progress}%`,
                      }}
                    />
                  </div>

                  <span className="integrity-progress-text">
                    {progress}% complete
                  </span>
                </>
              )}

              {!verifying && (
                <div className="integrity-success">
                  ✓ No integrity issues detected
                </div>
              )}

              <button
                className="integrity-verify-button"
                onClick={runVerification}
                disabled={verifying}
              >
                {verifying
                  ? "Verification in progress..."
                  : "Run Integrity Verification"}
              </button>

            </div>


            <div className="integrity-metrics-row">

              <div>
                <span>RECORDS CHECKED</span>
                <strong>12,842</strong>
                <small>100% verified</small>
              </div>

              <div>
                <span>HASH VERIFICATION</span>
                <strong>100%</strong>
                <small>All hashes valid</small>
              </div>

              <div>
                <span>TAMPERED RECORDS</span>
                <strong className="safe-integrity">
                  0
                </strong>
                <small>No issues detected</small>
              </div>

              <div>
                <span>INTEGRITY SCORE</span>
                <strong>99.8%</strong>
                <small>Excellent</small>
              </div>

            </div>

          </div>


          <div className="panel integrity-checks-panel">

            <div className="panel-header">

              <div>
                <h2>
                  Verification Checks
                </h2>

                <p>
                  Recent ledger security checks
                </p>
              </div>

              <div className="panel-status">
                <span></span>
                VERIFIED
              </div>

            </div>


            {checks.map(
              ([title, description, time]) => (

                <div
                  className="integrity-check-row"
                  key={title}
                >

                  <div className="integrity-check-icon">
                    ✓
                  </div>

                  <div>

                    <strong>
                      {title}
                    </strong>

                    <span>
                      {description}
                    </span>

                  </div>

                  <b>
                    PASSED
                  </b>

                  <small>
                    {time}
                  </small>

                </div>

              )
            )}

          </div>

        </div>

      </main>

    </div>
  );
}


/* =====================================================
   MAIN APP
===================================================== */

function App() {

  const [loggedIn, setLoggedIn] =
    useState(
      localStorage.getItem(
        "audittrail_auth"
      ) === "true"
    );

  const [page, setPage] =
    useState("dashboard");


  const handleLogin = () => {

    localStorage.setItem(
      "audittrail_auth",
      "true"
    );

    setLoggedIn(true);
    setPage("dashboard");
  };


  const handleLogout = () => {

    localStorage.removeItem(
      "audittrail_auth"
    );

    setLoggedIn(false);
    setPage("dashboard");
  };


  if (!loggedIn) {

    return (
      <LoginPage
        onLogin={handleLogin}
      />
    );
  }


  if (page === "dashboard") {

    return (
      <DashboardPage
        onNavigate={setPage}
        onLogout={handleLogout}
      />
    );
  }


  if (page === "containers") {

    return (
      <ContainersPage
        onNavigate={setPage}
        onLogout={handleLogout}
      />
    );
  }


  if (page === "timeline") {

    return (
      <EventTimeline
        onNavigate={setPage}
        onLogout={handleLogout}
      />
    );
  }


  if (page === "analytics") {

    return (
      <AnalyticsPage
        onNavigate={setPage}
        onLogout={handleLogout}
      />
    );
  }
if (page === "ai-insights") {
  return (
    <AIInsightsPage
      onNavigate={setPage}
      onLogout={handleLogout}
    />
  );
}

  if (page === "locations") {

    return (
      <LocationsPage
        onNavigate={setPage}
        onLogout={handleLogout}
      />
    );
  }


  if (page === "audit") {

    return (
      <AuditIntegrity
        onNavigate={setPage}
        onLogout={handleLogout}
      />
    );
  }


  if (page === "alerts") {

    return (
      <AlertsPage
        onNavigate={setPage}
        onLogout={handleLogout}
      />
    );
  }


  return null;
}

export default App;
