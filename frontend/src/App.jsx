import { useState } from "react";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ContainersPage from "./pages/ContainersPage";

function ModulePage({ title, description, type, onNavigate, onLogout }) {
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
      subtitle: "Monitor active shipment and container locations",
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
      subtitle: "Monitor shipment and audit performance",
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
      subtitle: "Verify the integrity of your event-sourced ledger",
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
      subtitle: "Review active warnings and system notifications",
      items: [
        ["Container CTN-48291", "Inspection required", "Medium"],
        ["Mumbai Port", "Delay detected", "Low"],
        ["Container CTN-73510", "Document verification pending", "Medium"],
        ["System", "All services operational", "Normal"],
      ],
    },
  };

  const current = data[type];

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
            className={`nav-link ${type === "dashboard" ? "active" : ""}`}
            onClick={() => onNavigate("dashboard")}
          >
            <span>◇</span> Dashboard
          </button>

          <button
            className={`nav-link ${type === "containers" ? "active" : ""}`}
            onClick={() => onNavigate("containers")}
          >
            <span>▣</span> Containers
          </button>

          <button
            className={`nav-link ${type === "timeline" ? "active" : ""}`}
            onClick={() => onNavigate("timeline")}
          >
            <span>◷</span> Event Timeline
          </button>

          <button
            className={`nav-link ${type === "locations" ? "active" : ""}`}
            onClick={() => onNavigate("locations")}
          >
            <span>⚑</span> Locations
          </button>

          <button
            className={`nav-link ${type === "analytics" ? "active" : ""}`}
            onClick={() => onNavigate("analytics")}
          >
            <span>▥</span> Analytics
          </button>

          <div className="sidebar-label security-label">SECURITY</div>

          <button
            className={`nav-link ${type === "audit" ? "active" : ""}`}
            onClick={() => onNavigate("audit")}
          >
            <span>◇</span> Audit Integrity
          </button>

          <button
            className={`nav-link ${type === "alerts" ? "active" : ""}`}
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
              title="Logout"
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
              <p className="eyebrow">AUDITTRAIL</p>
              <h1>{current.title}</h1>
              <p>{current.subtitle}</p>
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
                <h2>{current.title}</h2>
                <p>{current.subtitle}</p>
              </div>

              <div className="panel-status">
                <span></span>
                ACTIVE
              </div>
            </div>

            <div className="module-content">

              <div className="module-icon">
                {current.icon}
              </div>

              <h2>{current.title}</h2>
              <p>{current.subtitle}</p>

              <div className="module-list">
                {current.items.map((item, index) => (
                  <div className="module-row" key={index}>

                    <div className="module-row-icon">
                      {current.icon}
                    </div>

                    <div className="module-row-info">
                      <strong>{item[0]}</strong>
                      <span>{item[1]}</span>
                    </div>

                    <div className="module-row-status">
                      {item[2]}
                    </div>

                  </div>
                ))}
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}


function App() {
  const [loggedIn, setLoggedIn] = useState(
    localStorage.getItem("audittrail_auth") === "true"
  );

  const [page, setPage] = useState("dashboard");

  const handleLogin = () => {
    localStorage.setItem("audittrail_auth", "true");
    setLoggedIn(true);
    setPage("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("audittrail_auth");
    setLoggedIn(false);
    setPage("dashboard");
  };

  if (!loggedIn) {
    return <LoginPage onLogin={handleLogin} />;
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

  const pageData = {
    timeline: {
      title: "Event Timeline",
      description: "View the complete chronological history of events.",
    },
    locations: {
      title: "Locations",
      description: "Monitor ports, warehouses and shipment locations.",
    },
    analytics: {
      title: "Analytics",
      description: "View shipment and audit performance analytics.",
    },
    audit: {
      title: "Audit Integrity",
      description: "Verify the integrity of your event-sourced ledger.",
    },
    alerts: {
      title: "Alerts",
      description: "Review active warnings and system alerts.",
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