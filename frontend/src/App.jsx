import { useState } from "react";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ContainersPage from "./pages/ContainersPage";

function SimplePage({ title, description, onNavigate, activePage }) {
  const pageContent = {
    timeline: {
      icon: "◷",
      heading: "Recent Event Timeline",
      items: [
        ["v4", "ARRIVED_AT_PORT", "Mumbai Port", "14:32", "Verified"],
        ["v3", "TEMPERATURE_SPIKE", "Arabian Sea", "11:20", "Warning"],
        ["v2", "LOADED_ON_SHIP", "Warehouse-A", "08:45", "Verified"],
        ["v1", "CONTAINER_CREATED", "Warehouse-A", "07:10", "Verified"],
      ],
    },

    locations: {
      icon: "⚑",
      heading: "Active Locations",
      items: [
        ["Mumbai Port", "India", "8 Containers", "Active"],
        ["Dubai Port", "UAE", "5 Containers", "Active"],
        ["Arabian Sea", "Shipping Route", "7 Containers", "Tracking"],
        ["Warehouse-A", "Mumbai", "4 Containers", "Active"],
      ],
    },

    analytics: {
      icon: "▥",
      heading: "Shipment Analytics",
      items: [
        ["Total Shipments", "24", "+12%"],
        ["In Transit", "18", "+8%"],
        ["Delivered", "6", "+15%"],
        ["Average Temperature", "8.2°C", "Normal"],
      ],
    },

    audit: {
      icon: "◇",
      heading: "Ledger Integrity",
      items: [
        ["Ledger Status", "Verified", "All records valid"],
        ["Hash Verification", "Passed", "100% verified"],
        ["Event Consistency", "Passed", "No conflicts detected"],
        ["Last Audit", "2 minutes ago", "System verified"],
      ],
    },

    alerts: {
      icon: "!",
      heading: "Active Alerts",
      items: [
        ["TEMPERATURE_SPIKE", "CONT-001", "Arabian Sea", "Warning"],
        ["DELAY_DETECTED", "CONT-007", "Dubai Port", "Attention"],
        ["ROUTE_CHANGE", "CONT-012", "Mumbai Port", "Info"],
      ],
    },
  };

  const content = pageContent[activePage];

  return (
    <div className="audit-app">

      {/* SIDEBAR */}
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
            className={`nav-link ${
              activePage === "dashboard" ? "active" : ""
            }`}
            onClick={() => onNavigate("dashboard")}
          >
            <span>⌂</span>
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

        </nav>

        <div className="sidebar-label">SECURITY</div>

        <nav className="audit-nav">

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
            <span className="alert-count">3</span>
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
              onClick={() => {
                localStorage.removeItem("audittrail_logged_in");
                window.location.reload();
              }}
            >
              ↪
            </button>

          </div>

        </div>

      </aside>

      {/* MAIN CONTENT */}
      <main className="audit-main">

        {/* TOP BAR */}
        <header className="audit-topbar">

          <div className="breadcrumb">
            AuditTrail
            <span>/</span>
            {title}
          </div>

          <div className="topbar-right">

            <button
              className="notification"
              onClick={() => onNavigate("alerts")}
            >
              ♢
              <span>3</span>
            </button>

            <div className="top-user">

              <div className="top-avatar">A</div>

              <div>
                <strong>Admin</strong>
                <span>Administrator</span>
              </div>

            </div>

          </div>

        </header>

        {/* PAGE */}
        <div className="audit-content">

          {/* HEADING */}
          <div className="page-heading">

            <div>

              <p className="eyebrow">
                AUDITTRAIL / {title.toUpperCase()}
              </p>

              <h1>{title}</h1>

              <p>{description}</p>

            </div>

            <div className="integrity-pill">
              <span>✓</span>
              System Operational
            </div>

          </div>

          {/* STAT CARDS */}
          <div className="stats-grid">

            <div className="stat-card">

              <div className="stat-card-top">
                <div className="stat-icon blue-bg">
                  {content?.icon || "✓"}
                </div>
              </div>

              <p className="stat-label">STATUS</p>

              <h2 className="stat-number">Active</h2>

              <span className="stat-description">
                System operating normally
              </span>

            </div>

            <div className="stat-card">

              <div className="stat-card-top">
                <div className="stat-icon purple-bg">
                  ▣
                </div>
              </div>

              <p className="stat-label">RECORDS</p>

              <h2 className="stat-number">
                {activePage === "alerts" ? "3" : "24"}
              </h2>

              <span className="stat-description">
                Currently tracked
              </span>

            </div>

            <div className="stat-card">

              <div className="stat-card-top">
                <div className="stat-icon cyan-bg">
                  ✓
                </div>
              </div>

              <p className="stat-label">VERIFIED</p>

              <h2 className="stat-number">100%</h2>

              <span className="stat-description">
                Data integrity verified
              </span>

            </div>

            <div className="stat-card">

              <div className="stat-card-top">
                <div className="stat-icon orange-bg">
                  !
                </div>
              </div>

              <p className="stat-label">ATTENTION</p>

              <h2 className="stat-number">
                {activePage === "alerts" ? "3" : "0"}
              </h2>

              <span className="stat-description">
                Items requiring review
              </span>

            </div>

          </div>

          {/* MAIN PANEL */}
          <section className="panel">

            <div className="panel-header">

              <div>
                <h2>{content?.heading}</h2>
                <p>{description}</p>
              </div>

            </div>

            {/* EVENT TIMELINE */}
            {activePage === "timeline" && (

              <div className="events-list">

                {content.items.map((item) => (

                  <div className="event-row" key={item[0]}>

                    <div className="event-marker"></div>

                    <div className="event-main">

                      <div className="event-title-row">

                        <strong>{item[1]}</strong>

                        <span className="event-version">
                          {item[0]}
                        </span>

                      </div>

                      <div className="event-location">
                        📍 {item[2]}
                      </div>

                    </div>

                    <div className="event-right">

                      <span className="event-time">
                        {item[3]}
                      </span>

                      <span
                        className={
                          item[4] === "Warning"
                            ? "event-status warning"
                            : "event-status verified"
                        }
                      >
                        {item[4]}
                      </span>

                    </div>

                  </div>

                ))}

              </div>

            )}

            {/* LOCATIONS */}
            {activePage === "locations" && (

              <div className="container-list">

                {content.items.map((item) => (

                  <div
                    className="container-row"
                    key={item[0]}
                  >

                    <div className="container-box">
                      📍
                    </div>

                    <div className="container-info">

                      <strong>{item[0]}</strong>

                      <span>{item[1]}</span>

                    </div>

                    <div className="container-location">

                      <strong>{item[2]}</strong>

                      <span>Containers</span>

                    </div>

                    <span className="event-status verified">
                      {item[3]}
                    </span>

                  </div>

                ))}

              </div>

            )}

            {/* ANALYTICS */}
            {activePage === "analytics" && (

              <div className="container-list">

                {content.items.map((item) => (

                  <div
                    className="container-row"
                    key={item[0]}
                  >

                    <div className="container-box">
                      ▥
                    </div>

                    <div className="container-info">

                      <strong>{item[0]}</strong>

                      <span>Current metric</span>

                    </div>

                    <div className="container-location">

                      <strong>{item[1]}</strong>

                    </div>

                    <span className="event-status verified">
                      {item[2]}
                    </span>

                  </div>

                ))}

              </div>

            )}

            {/* AUDIT INTEGRITY */}
            {activePage === "audit" && (

              <div className="container-list">

                {content.items.map((item) => (

                  <div
                    className="container-row"
                    key={item[0]}
                  >

                    <div className="container-box">
                      ✓
                    </div>

                    <div className="container-info">

                      <strong>{item[0]}</strong>

                      <span>
                        Security verification
                      </span>

                    </div>

                    <div className="container-location">

                      <strong>{item[1]}</strong>

                      <span>{item[2]}</span>

                    </div>

                    <span className="event-status verified">
                      PASSED
                    </span>

                  </div>

                ))}

              </div>

            )}

            {/* ALERTS */}
            {activePage === "alerts" && (

              <div className="container-list">

                {content.items.map((item) => (

                  <div
                    className="container-row"
                    key={item[0]}
                  >

                    <div className="container-box">
                      !
                    </div>

                    <div className="container-info">

                      <strong>{item[0]}</strong>

                      <span>{item[1]}</span>

                    </div>

                    <div className="container-location">

                      <strong>{item[2]}</strong>

                    </div>

                    <span
                      className={
                        item[3] === "Warning"
                          ? "event-status warning"
                          : "event-status verified"
                      }
                    >
                      {item[3]}
                    </span>

                  </div>

                ))}

              </div>

            )}

          </section>

          {/* FOOTER */}
          <footer className="dashboard-footer">

            <span>AuditTrail © 2026</span>

            <span>
              Last synchronized just now
            </span>

            <span>
              🔒 Secure ledger
            </span>

          </footer>

        </div>

      </main>

    </div>
  );
}


// =============================
// MAIN APP
// =============================

function App() {

  const [loggedIn, setLoggedIn] = useState(
    localStorage.getItem("audittrail_logged_in") === "true"
  );

  const [page, setPage] = useState("dashboard");


  // LOGIN
  if (!loggedIn) {

    return (
      <LoginPage
        onLogin={() => setLoggedIn(true)}
      />
    );

  }


  // DASHBOARD
  if (page === "dashboard") {

    return (
      <DashboardPage
        onNavigate={setPage}
        onLogout={() => {

          localStorage.removeItem(
            "audittrail_logged_in"
          );

          setLoggedIn(false);

        }}
      />
    );

  }


  // CONTAINERS
  if (page === "containers") {

    return (
      <ContainersPage
        onNavigate={setPage}
      />
    );

  }


  // OTHER PAGES
  const pages = {

    timeline: [
      "Event Timeline",
      "View the complete chronological history of events.",
    ],

    locations: [
      "Locations",
      "Monitor ports, warehouses and shipment locations.",
    ],

    analytics: [
      "Analytics",
      "View shipment and audit performance analytics.",
    ],

    audit: [
      "Audit Integrity",
      "Verify the integrity of your event-sourced ledger.",
    ],

    alerts: [
      "Alerts",
      "Review active warnings and system alerts.",
    ],

  };


  return (

    <SimplePage
      title={pages[page][0]}
      description={pages[page][1]}
      activePage={page}
      onNavigate={setPage}
    />

  );

}

export default App;