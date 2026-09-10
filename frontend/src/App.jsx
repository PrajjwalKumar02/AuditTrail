import { useState } from "react";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ContainersPage from "./pages/ContainersPage";
import EventTimeline from "./pages/EventTimeline";
import AnalyticsPage from "./pages/AnalyticsPage";
import LocationCard from "./pages/LocationCard";


/* ================= LOCATIONS ================= */

function LocationsPage({ onNavigate, onLogout }) {
  const locations = [
    {
      name: "Mumbai Port",
      containers: "128",
      shipments: "34",
      temperature: "5.2°C",
      updated: "2 min ago",
      coordinates: "18.9388° N, 72.8354° E",
    },
    {
      name: "JNPT Terminal",
      containers: "94",
      shipments: "27",
      temperature: "4.8°C",
      updated: "5 min ago",
      coordinates: "18.9490° N, 72.9500° E",
    },
    {
      name: "Dubai Port",
      containers: "76",
      shipments: "19",
      temperature: "7.1°C",
      updated: "8 min ago",
      coordinates: "25.2697° N, 55.3095° E",
    },
    {
      name: "Singapore Port",
      containers: "52",
      shipments: "14",
      temperature: "4.1°C",
      updated: "12 min ago",
      coordinates: "1.2644° N, 103.8200° E",
    },
  ];

  return (
    <div className="audit-app">

      <aside className="audit-sidebar">

        <div className="audit-brand">
          <div className="audit-brand-logo">AT</div>

          <div>
            <h2>AuditTrail</h2>
            <span>FORENSIC LEDGER</span>
          </div>
        </div>

        <div className="sidebar-label">WORKSPACE</div>

        <nav className="audit-nav">

          <button
            className="nav-link"
            onClick={() => onNavigate("dashboard")}
          >
            <span>◇</span> Dashboard
          </button>

          <button
            className="nav-link"
            onClick={() => onNavigate("containers")}
          >
            <span>▣</span> Containers
          </button>

          <button
            className="nav-link"
            onClick={() => onNavigate("timeline")}
          >
            <span>◷</span> Event Timeline
          </button>

          <button className="nav-link active">
            <span>⚑</span> Locations
          </button>

          <button
            className="nav-link"
            onClick={() => onNavigate("analytics")}
          >
            <span>▥</span> Analytics
          </button>

          <div className="sidebar-label security-label">
            SECURITY
          </div>

          <button
            className="nav-link"
            onClick={() => onNavigate("audit")}
          >
            <span>◇</span> Audit Integrity
          </button>

          <button
            className="nav-link"
            onClick={() => onNavigate("alerts")}
          >
            <span>!</span> Alerts
          </button>

        </nav>

        <div className="sidebar-bottom">

          <div className="system-status">
            <span className="status-dot"></span>

            <div>
              <strong>System Operational</strong>
              <small>All services running</small>
            </div>
          </div>

          <div className="sidebar-user">

            <div className="user-avatar">A</div>

            <div className="user-info">
              <strong>Admin</strong>
              <span>Administrator</span>
            </div>

            <button
              className="logout-button"
              onClick={onLogout}
            >
              ↪
            </button>

          </div>

        </div>

      </aside>


      <main className="audit-main">

        <div className="audit-content">

          <div className="page-heading">

            <div>
              <p className="eyebrow">AUDITTRAIL</p>

              <h1>Locations</h1>

              <p>
                Monitor active shipment and container locations.
              </p>
            </div>

            <div className="dashboard-live">
              <span></span>
              LIVE
            </div>

          </div>


          <div className="panel module-panel">

            <div className="panel-header">

              <div>
                <h2>Active Locations</h2>

                <p>
                  Live container monitoring across locations
                </p>
              </div>

              <div className="panel-status">
                <span></span>
                ACTIVE
              </div>

            </div>


            <div className="locations-working-list">

              {locations.map((location, index) => (

                <LocationCard
                  key={index}
                  container={{
                    location: location.name,
                    containers: location.containers,
                    shipments: location.shipments,
                    temperature: location.temperature,
                    lastUpdated: location.updated,
                    coordinates: location.coordinates,
                  }}
                />

              ))}

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}


/* ================= ALERTS ================= */

function AlertsPage({ onNavigate, onLogout }) {

  const [alerts, setAlerts] = useState([
    {
      id: 1,
      title: "Container CTN-48291",
      message: "Inspection required",
      severity: "Medium",
      time: "2 min ago",
      status: "Active",
    },
    {
      id: 2,
      title: "Mumbai Port",
      message: "Delay detected",
      severity: "Low",
      time: "8 min ago",
      status: "Active",
    },
    {
      id: 3,
      title: "Container CTN-73510",
      message: "Document verification pending",
      severity: "Medium",
      time: "15 min ago",
      status: "Active",
    },
    {
      id: 4,
      title: "System",
      message: "All services operational",
      severity: "Normal",
      time: "21 min ago",
      status: "Active",
    },
  ]);

  const [selectedAlert, setSelectedAlert] = useState(null);

  const acknowledgeAlert = (id) => {
    setAlerts((current) =>
      current.map((alert) =>
        alert.id === id
          ? { ...alert, status: "Acknowledged" }
          : alert
      )
    );

    setSelectedAlert(null);
  };

  const activeAlerts = alerts.filter(
    (alert) => alert.status === "Active"
  ).length;

  return (
    <div className="audit-app">

      <aside className="audit-sidebar">

        <div className="audit-brand">
          <div className="audit-brand-logo">AT</div>

          <div>
            <h2>AuditTrail</h2>
            <span>FORENSIC LEDGER</span>
          </div>
        </div>

        <div className="sidebar-label">WORKSPACE</div>

        <nav className="audit-nav">

          <button
            className="nav-link"
            onClick={() => onNavigate("dashboard")}
          >
            <span>◇</span> Dashboard
          </button>

          <button
            className="nav-link"
            onClick={() => onNavigate("containers")}
          >
            <span>▣</span> Containers
          </button>

          <button
            className="nav-link"
            onClick={() => onNavigate("timeline")}
          >
            <span>◷</span> Event Timeline
          </button>

          <button
            className="nav-link"
            onClick={() => onNavigate("locations")}
          >
            <span>⚑</span> Locations
          </button>

          <button
            className="nav-link"
            onClick={() => onNavigate("analytics")}
          >
            <span>▥</span> Analytics
          </button>

          <div className="sidebar-label security-label">
            SECURITY
          </div>

          <button
            className="nav-link"
            onClick={() => onNavigate("audit")}
          >
            <span>◇</span> Audit Integrity
          </button>

          <button className="nav-link active">
            <span>!</span> Alerts
          </button>

        </nav>

        <div className="sidebar-bottom">

          <div className="system-status">
            <span className="status-dot"></span>

            <div>
              <strong>System Operational</strong>
              <small>All services running</small>
            </div>
          </div>

          <div className="sidebar-user">

            <div className="user-avatar">A</div>

            <div className="user-info">
              <strong>Admin</strong>
              <span>Administrator</span>
            </div>

            <button
              className="logout-button"
              onClick={onLogout}
            >
              ↪
            </button>

          </div>

        </div>

      </aside>


      <main className="audit-main">

        <div className="audit-content">

          <div className="page-heading">

            <div>
              <p className="eyebrow">AUDITTRAIL</p>

              <h1>Alerts</h1>

              <p>
                Review active warnings and system notifications.
              </p>
            </div>

            <div className="dashboard-live">
              <span></span>
              LIVE
            </div>

          </div>


          <div className="alerts-summary">

            <div>
              <span>ACTIVE ALERTS</span>
              <strong>{activeAlerts}</strong>
              <small>Require attention</small>
            </div>

            <div>
              <span>TOTAL ALERTS</span>
              <strong>{alerts.length}</strong>
              <small>Recorded notifications</small>
            </div>

            <div>
              <span>SYSTEM STATUS</span>
              <strong className="alert-safe">
                Operational
              </strong>
              <small>All services running</small>
            </div>

          </div>


          <div className="panel alerts-panel">

            <div className="panel-header">

              <div>
                <h2>Active Alerts</h2>
                <p>
                  Warnings and notifications requiring review
                </p>
              </div>

              <div className="panel-status">
                <span></span>
                {activeAlerts} ACTIVE
              </div>

            </div>


            <div className="alerts-list">

              {alerts.map((alert) => (

                <div
                  className={`alert-working-card ${
                    alert.status === "Acknowledged"
                      ? "acknowledged"
                      : ""
                  }`}
                  key={alert.id}
                  onClick={() => setSelectedAlert(alert)}
                >

                  <div className="alert-icon">
                    {alert.severity === "Normal"
                      ? "✓"
                      : "!"}
                  </div>

                  <div className="alert-info">

                    <strong>
                      {alert.title}
                    </strong>

                    <span>
                      {alert.message}
                    </span>

                  </div>

                  <div className="alert-time">
                    {alert.time}
                  </div>

                  <div className="alert-severity">
                    {alert.status === "Acknowledged"
                      ? "Acknowledged"
                      : alert.severity}
                  </div>

                  <div className="alert-arrow">
                    →
                  </div>

                </div>

              ))}

            </div>

          </div>

        </div>

      </main>


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

                <h2>
                  {selectedAlert.title}
                </h2>

                <p>
                  {selectedAlert.message}
                </p>

              </div>

              <button
                onClick={() => setSelectedAlert(null)}
              >
                ×
              </button>

            </div>


            <div className="alert-detail-status">
              <span></span>
              {selectedAlert.status}
            </div>


            <div className="alert-detail-grid">

              <div>
                <small>SEVERITY</small>
                <strong>
                  {selectedAlert.severity}
                </strong>
              </div>

              <div>
                <small>TIME</small>
                <strong>
                  {selectedAlert.time}
                </strong>
              </div>

              <div>
                <small>ALERT ID</small>
                <strong>
                  ALT-{String(selectedAlert.id).padStart(4, "0")}
                </strong>
              </div>

              <div>
                <small>SOURCE</small>
                <strong>
                  AuditTrail Monitor
                </strong>
              </div>

            </div>


            <div className="alert-description">

              <h3>Recommended Action</h3>

              <p>
                Review this notification and verify the
                associated container or system activity.
              </p>

            </div>


            {selectedAlert.status === "Active" && (

              <button
                className="alert-acknowledge"
                onClick={() =>
                  acknowledgeAlert(selectedAlert.id)
                }
              >
                ✓ Acknowledge Alert
              </button>

            )}

          </div>

        </div>

      )}

    </div>
  );
}


/* ================= AUDIT INTEGRITY ================= */

function AuditIntegrity({ onNavigate, onLogout }) {

  const [verifying, setVerifying] = useState(false);
  const [progress, setProgress] = useState(100);

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

  return (
    <div className="audit-app">

      <aside className="audit-sidebar">

        <div className="audit-brand">
          <div className="audit-brand-logo">AT</div>

          <div>
            <h2>AuditTrail</h2>
            <span>FORENSIC LEDGER</span>
          </div>
        </div>

        <div className="sidebar-label">WORKSPACE</div>

        <nav className="audit-nav">

          <button
            className="nav-link"
            onClick={() => onNavigate("dashboard")}
          >
            <span>◇</span> Dashboard
          </button>

          <button
            className="nav-link"
            onClick={() => onNavigate("containers")}
          >
            <span>▣</span> Containers
          </button>

          <button
            className="nav-link"
            onClick={() => onNavigate("timeline")}
          >
            <span>◷</span> Event Timeline
          </button>

          <button
            className="nav-link"
            onClick={() => onNavigate("locations")}
          >
            <span>⚑</span> Locations
          </button>

          <button
            className="nav-link"
            onClick={() => onNavigate("analytics")}
          >
            <span>▥</span> Analytics
          </button>

          <div className="sidebar-label security-label">
            SECURITY
          </div>

          <button className="nav-link active">
            <span>◇</span> Audit Integrity
          </button>

          <button
            className="nav-link"
            onClick={() => onNavigate("alerts")}
          >
            <span>!</span> Alerts
          </button>

        </nav>

        <div className="sidebar-bottom">

          <div className="system-status">
            <span className="status-dot"></span>

            <div>
              <strong>System Operational</strong>
              <small>All services running</small>
            </div>
          </div>

          <div className="sidebar-user">

            <div className="user-avatar">A</div>

            <div className="user-info">
              <strong>Admin</strong>
              <span>Administrator</span>
            </div>

            <button
              className="logout-button"
              onClick={onLogout}
            >
              ↪
            </button>

          </div>

        </div>

      </aside>


      <main className="audit-main">

        <div className="audit-content">

          <div className="page-heading">

            <div>
              <p className="eyebrow">AUDITTRAIL</p>

              <h1>Audit Integrity</h1>

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
                <h2>Ledger Integrity</h2>
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

              <div className="integrity-icon">
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
                <h2>Verification Checks</h2>
                <p>Recent ledger security checks</p>
              </div>

              <div className="panel-status">
                <span></span>
                VERIFIED
              </div>

            </div>


            {[
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
            ].map((check, index) => (

              <div className="integrity-check-row" key={index}>

                <div className="integrity-check-icon">
                  ✓
                </div>

                <div>
                  <strong>{check[0]}</strong>
                  <span>{check[1]}</span>
                </div>

                <b>PASSED</b>

                <small>{check[2]}</small>

              </div>

            ))}

          </div>

        </div>

      </main>

    </div>
  );
}


/* ================= APP ================= */

function App() {

  const [loggedIn, setLoggedIn] = useState(
    localStorage.getItem("audittrail_auth") === "true"
  );

  const [page, setPage] = useState("dashboard");


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
      <LoginPage onLogin={handleLogin} />
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