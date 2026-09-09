import { useState } from "react";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ContainersPage from "./pages/ContainersPage";
import EventTimeline from "./pages/EventTimeline";
import AnalyticsPage from "./pages/AnalyticsPage";
import LocationCard from "./pages/LocationCard";


/* =====================================================
   AUDIT INTEGRITY
===================================================== */

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

      {/* ================= SIDEBAR ================= */}

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
            className="nav-link"
            onClick={() => onNavigate("dashboard")}
          >
            <span>◇</span>
            Dashboard
          </button>


          <button
            className="nav-link"
            onClick={() => onNavigate("containers")}
          >
            <span>▣</span>
            Containers
          </button>


          <button
            className="nav-link"
            onClick={() => onNavigate("timeline")}
          >
            <span>◷</span>
            Event Timeline
          </button>


          <button
            className="nav-link"
            onClick={() => onNavigate("locations")}
          >
            <span>⚑</span>
            Locations
          </button>


          <button
            className="nav-link"
            onClick={() => onNavigate("analytics")}
          >
            <span>▥</span>
            Analytics
          </button>


          <div className="sidebar-label security-label">
            SECURITY
          </div>


          <button className="nav-link active">
            <span>◇</span>
            Audit Integrity
          </button>


          <button
            className="nav-link"
            onClick={() => onNavigate("alerts")}
          >
            <span>!</span>
            Alerts
          </button>

        </nav>


        {/* SIDEBAR BOTTOM */}

        <div className="sidebar-bottom">

          <div className="system-status">

            <span className="status-dot"></span>

            <div>
              <strong>System Operational</strong>
              <small>All services running</small>
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


      {/* ================= MAIN ================= */}

      <main className="audit-main">

        <div className="audit-content">

          {/* PAGE HEADER */}

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


          {/* ================= LEDGER INTEGRITY ================= */}

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


            {/* VERIFICATION CENTER */}

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


              {/* PROGRESS */}

              {verifying && (
                <>
                  <div className="integrity-progress">

                    <div
                      style={{
                        width: `${progress}%`,
                      }}
                    ></div>

                  </div>

                  <span className="integrity-progress-text">
                    {progress}% complete
                  </span>
                </>
              )}


              {/* SUCCESS */}

              {!verifying && (
                <div className="integrity-success">
                  ✓ No integrity issues detected
                </div>
              )}


              {/* VERIFY BUTTON */}

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


            {/* ================= METRICS ================= */}

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


          {/* ================= VERIFICATION CHECKS ================= */}

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


            {/* CHECK 1 */}

            <div className="integrity-check-row">

              <div className="integrity-check-icon">
                ✓
              </div>

              <div>

                <strong>
                  Ledger Chain Verification
                </strong>

                <span>
                  Complete event chain validated
                </span>

              </div>

              <b>
                PASSED
              </b>

              <small>
                Just now
              </small>

            </div>


            {/* CHECK 2 */}

            <div className="integrity-check-row">

              <div className="integrity-check-icon">
                ✓
              </div>

              <div>

                <strong>
                  Hash Integrity Check
                </strong>

                <span>
                  Stored hashes successfully matched
                </span>

              </div>

              <b>
                PASSED
              </b>

              <small>
                2 min ago
              </small>

            </div>


            {/* CHECK 3 */}

            <div className="integrity-check-row">

              <div className="integrity-check-icon">
                ✓
              </div>

              <div>

                <strong>
                  Event Sequence Validation
                </strong>

                <span>
                  Chronological event ordering verified
                </span>

              </div>

              <b>
                PASSED
              </b>

              <small>
                5 min ago
              </small>

            </div>


            {/* CHECK 4 */}

            <div className="integrity-check-row">

              <div className="integrity-check-icon">
                ✓
              </div>

              <div>

                <strong>
                  Container Audit Validation
                </strong>

                <span>
                  Container audit records validated
                </span>

              </div>

              <b>
                PASSED
              </b>

              <small>
                8 min ago
              </small>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}


/* =====================================================
   LOCATIONS / ALERTS MODULE
===================================================== */

function ModulePage({
  type,
  onNavigate,
  onLogout,
}) {

  const data = {

    locations: {
      icon: "⚑",
      title: "Locations",
      subtitle:
        "Monitor active shipment and container locations",

      items: [
        ["Mumbai Port", "128 containers", "Operational"],
        ["JNPT Terminal", "94 containers", "Operational"],
        ["Dubai Port", "76 containers", "Operational"],
        ["Singapore Port", "52 containers", "Operational"],
      ],
    },


    alerts: {
      icon: "!",
      title: "Alerts",
      subtitle:
        "Review active warnings and system notifications",

      items: [
        [
          "Container CTN-48291",
          "Inspection required",
          "Medium",
        ],

        [
          "Mumbai Port",
          "Delay detected",
          "Low",
        ],

        [
          "Container CTN-73510",
          "Document verification pending",
          "Medium",
        ],

        [
          "System",
          "All services operational",
          "Normal",
        ],
      ],
    },

  };


  const current = data[type];


  return (
    <div className="audit-app">

      {/* SIDEBAR */}

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
              type === "dashboard" ? "active" : ""
            }`}
            onClick={() => onNavigate("dashboard")}
          >
            <span>◇</span>
            Dashboard
          </button>


          <button
            className={`nav-link ${
              type === "containers" ? "active" : ""
            }`}
            onClick={() => onNavigate("containers")}
          >
            <span>▣</span>
            Containers
          </button>


          <button
            className={`nav-link ${
              type === "timeline" ? "active" : ""
            }`}
            onClick={() => onNavigate("timeline")}
          >
            <span>◷</span>
            Event Timeline
          </button>


          <button
            className={`nav-link ${
              type === "locations" ? "active" : ""
            }`}
            onClick={() => onNavigate("locations")}
          >
            <span>⚑</span>
            Locations
          </button>


          <button
            className={`nav-link ${
              type === "analytics" ? "active" : ""
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
            className="nav-link"
            onClick={() => onNavigate("audit")}
          >
            <span>◇</span>
            Audit Integrity
          </button>


          <button
            className={`nav-link ${
              type === "alerts" ? "active" : ""
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
            >
              ↪
            </button>

          </div>

        </div>

      </aside>


      {/* MAIN */}

      <main className="audit-main">

        <div className="audit-content">

          <div className="page-heading">

            <div>

              <p className="eyebrow">
                AUDITTRAIL
              </p>

              <h1>
                {current.title}
              </h1>

              <p>
                {current.subtitle}
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

                <h2>
                  {current.title}
                </h2>

                <p>
                  {current.subtitle}
                </p>

              </div>


              <div className="panel-status">

                <span></span>
                ACTIVE

              </div>

            </div>


            {/* LOCATIONS */}

            {type === "locations" ? (

              <div className="locations-working-list">

                {current.items.map((item, index) => {

                  const locationData = {

                    location: item[0],

                    lastUpdated:
                      index === 0
                        ? "2 min ago"
                        : index === 1
                        ? "5 min ago"
                        : index === 2
                        ? "8 min ago"
                        : "12 min ago",

                    containers:
                      item[1].replace(
                        " containers",
                        ""
                      ),

                    shipments:
                      index === 0
                        ? "34"
                        : index === 1
                        ? "27"
                        : index === 2
                        ? "19"
                        : "14",

                    temperature:
                      index === 0
                        ? "5.2°C"
                        : index === 1
                        ? "4.8°C"
                        : index === 2
                        ? "7.1°C"
                        : "4.1°C",

                    coordinates:
                      index === 0
                        ? "18.9388° N, 72.8354° E"
                        : index === 1
                        ? "18.9490° N, 72.9500° E"
                        : index === 2
                        ? "25.2697° N, 55.3095° E"
                        : "1.2644° N, 103.8200° E",
                  };


                  return (
                    <LocationCard
                      key={index}
                      container={locationData}
                    />
                  );

                })}

              </div>

            ) : (

              /* ALERTS */

              <div className="module-content">

                <div className="module-icon">
                  {current.icon}
                </div>

                <h2>
                  {current.title}
                </h2>

                <p>
                  {current.subtitle}
                </p>


                <div className="module-list">

                  {current.items.map(
                    (item, index) => (

                      <div
                        className="module-row"
                        key={index}
                      >

                        <div className="module-row-icon">
                          {current.icon}
                        </div>


                        <div className="module-row-info">

                          <strong>
                            {item[0]}
                          </strong>

                          <span>
                            {item[1]}
                          </span>

                        </div>


                        <div className="module-row-status">
                          {item[2]}
                        </div>

                      </div>

                    )
                  )}

                </div>

              </div>

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

  const [loggedIn, setLoggedIn] = useState(
    localStorage.getItem("audittrail_auth") === "true"
  );


  const [page, setPage] = useState(
    "dashboard"
  );


  /* LOGIN */

  const handleLogin = () => {

    localStorage.setItem(
      "audittrail_auth",
      "true"
    );

    setLoggedIn(true);
    setPage("dashboard");

  };


  /* LOGOUT */

  const handleLogout = () => {

    localStorage.removeItem(
      "audittrail_auth"
    );

    setLoggedIn(false);
    setPage("dashboard");

  };


  /* LOGIN */

  if (!loggedIn) {

    return (
      <LoginPage
        onLogin={handleLogin}
      />
    );

  }


  /* DASHBOARD */

  if (page === "dashboard") {

    return (
      <DashboardPage
        onNavigate={setPage}
        onLogout={handleLogout}
      />
    );

  }


  /* CONTAINERS */

  if (page === "containers") {

    return (
      <ContainersPage
        onNavigate={setPage}
        onLogout={handleLogout}
      />
    );

  }


  /* EVENT TIMELINE */

  if (page === "timeline") {

    return (
      <EventTimeline
        onNavigate={setPage}
        onLogout={handleLogout}
      />
    );

  }


  /* ANALYTICS */

  if (page === "analytics") {

    return (
      <AnalyticsPage
        onNavigate={setPage}
        onLogout={handleLogout}
      />
    );

  }


  /* AUDIT INTEGRITY */

  if (page === "audit") {

    return (
      <AuditIntegrity
        onNavigate={setPage}
        onLogout={handleLogout}
      />
    );

  }


  /* LOCATIONS / ALERTS */

  if (
    page === "locations" ||
    page === "alerts"
  ) {

    return (
      <ModulePage
        type={page}
        onNavigate={setPage}
        onLogout={handleLogout}
      />
    );

  }


  return null;
}


export default App;