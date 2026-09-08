import { useState } from "react";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ContainersPage from "./pages/ContainersPage";
import EventTimeline from "./pages/EventTimeline";
import LocationCard from "./pages/LocationCard";
import AnalyticsPage from "./pages/AnalyticsPage";

function ModulePage({
  title,
  description,
  type,
  onNavigate,
  onLogout,
}) {
  const data = {
    timeline: {
      icon: "◷",
      title: "Event Timeline",
      subtitle: "Chronological history of all container events",
      items: [
        ["Container CTN-48291", "Gate In", "2 min ago"],
        ["Container CTN-19472", "Inspection Completed", "18 min ago"],
        ["Container CTN-73510", "Loaded on Vessel", "42 min ago"],
        ["Container CTN-38194", "Gate Out", "1 hr ago"],
      ],
    },

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

    analytics: {
      icon: "▥",
      title: "Analytics",
      subtitle:
        "Monitor shipment and audit performance",
      items: [
        ["Total Containers", "1,284", "+12.4%"],
        ["Completed Audits", "968", "+8.7%"],
        ["Verified Events", "5,421", "+16.2%"],
        ["Integrity Score", "99.8%", "+0.4%"],
      ],
    },

    audit: {
      icon: "✓",
      title: "Audit Integrity",
      subtitle:
        "Verify the integrity of your event-sourced ledger",
      items: [
        ["Ledger Status", "Verified", "Healthy"],
        ["Records Checked", "12,842", "100%"],
        ["Hash Verification", "Passed", "Secure"],
        ["Tampered Records", "0", "No Issues"],
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
        ["Mumbai Port", "Delay detected", "Low"],
        [
          "Container CTN-73510",
          "Document verification pending",
          "Medium",
        ],
        ["System", "All services operational", "Normal"],
      ],
    },
  };

  const current = data[type];

  return (
    <div className="audit-app">

      {/* ================= SIDEBAR ================= */}

      <aside className="audit-sidebar">

        <div className="audit-brand">
          <div className="audit-brand-logo">AT</div>

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
            className={`nav-link ${
              type === "audit" ? "active" : ""
            }`}
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

          {/* PAGE HEADING */}

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

          {/* MAIN PANEL */}

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

            {/* MODULE CONTENT */}

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

              {/* ================= LOCATIONS ================= */}

              {type === "locations" ? (

                <div className="locations-working-list">

                  {current.items.map(
                    (item, index) => {

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
                    }
                  )}

                </div>

              ) : (

                /* ================= OTHER MODULES ================= */

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

              )}

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}


/* =====================================================
   APP
===================================================== */

function App() {

  const [loggedIn, setLoggedIn] = useState(
    localStorage.getItem("audittrail_auth") ===
      "true"
  );

  const [page, setPage] =
    useState("dashboard");


  /* ================= LOGIN ================= */

  const handleLogin = () => {

    localStorage.setItem(
      "audittrail_auth",
      "true"
    );

    setLoggedIn(true);
    setPage("dashboard");
  };


  /* ================= LOGOUT ================= */

  const handleLogout = () => {

    localStorage.removeItem(
      "audittrail_auth"
    );

    setLoggedIn(false);
    setPage("dashboard");
  };


  /* ================= LOGIN PAGE ================= */

  if (!loggedIn) {

    return (
      <LoginPage
        onLogin={handleLogin}
      />
    );
  }


  /* ================= DASHBOARD ================= */

  if (page === "dashboard") {

    return (
      <DashboardPage
        onNavigate={setPage}
        onLogout={handleLogout}
      />
    );
  }


  /* ================= CONTAINERS ================= */

  if (page === "containers") {

    return (
      <ContainersPage
        onNavigate={setPage}
        onLogout={handleLogout}
      />
    );
  }


  /* ================= EVENT TIMELINE ================= */

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

  /* ================= OTHER PAGES ================= */

  const pageData = {

    locations: {
      title: "Locations",
      description:
        "Monitor ports, warehouses and shipment locations.",
    },

    analytics: {
      title: "Analytics",
      description:
        "View shipment and audit performance analytics.",
    },

    audit: {
      title: "Audit Integrity",
      description:
        "Verify the integrity of your event-sourced ledger.",
    },

    alerts: {
      title: "Alerts",
      description:
        "Review active warnings and system alerts.",
    },

  };


  const current = pageData[page];


  return (
    <ModulePage
      title={current.title}
      description={current.description}
      type={page}
      onNavigate={setPage}
      onLogout={handleLogout}
    />
  );
}


export default App;