import { useState } from "react";

export default function DashboardPage({ onNavigate, onLogout }) {
  const [search, setSearch] = useState("");

  const events = [
    {
      version: "v4",
      type: "ARRIVED_AT_PORT",
      location: "Mumbai Port",
      time: "14:32",
      status: "Verified",
      statusClass: "verified",
    },
    {
      version: "v3",
      type: "TEMPERATURE_SPIKE",
      location: "Arabian Sea",
      time: "11:20",
      status: "Warning",
      statusClass: "warning",
    },
    {
      version: "v2",
      type: "LOADED_ON_SHIP",
      location: "Warehouse-A",
      time: "08:45",
      status: "Verified",
      statusClass: "verified",
    },
    {
      version: "v1",
      type: "CONTAINER_CREATED",
      location: "Warehouse-A",
      time: "07:10",
      status: "Verified",
      statusClass: "verified",
    },
  ];

  const containers = [
    {
      id: "CONT-001",
      shipment: "MSC-001",
      location: "Mumbai Port",
      status: "In Transit",
    },
    {
      id: "CONT-002",
      shipment: "MSC-002",
      location: "Dubai Port",
      status: "Delivered",
    },
    {
      id: "CONT-003",
      shipment: "MSC-003",
      location: "Arabian Sea",
      status: "In Transit",
    },
  ];

  const filteredContainers = containers.filter((container) =>
    container.id.toLowerCase().includes(search.toLowerCase())
  );

  const goTo = (page) => {
    if (onNavigate) {
      onNavigate(page);
    }
  };

  return (
    <div className="audit-app">

      {/* ================= SIDEBAR ================= */}
      <aside className="audit-sidebar">

        {/* Brand */}
        <div className="audit-brand">
          <div className="audit-brand-logo">AT</div>

          <div>
            <h2>AuditTrail</h2>
            <span>FORENSIC LEDGER</span>
          </div>
        </div>

        {/* Workspace */}
        <div className="sidebar-label">WORKSPACE</div>

        <nav className="audit-nav">

          <button
            className="nav-link active"
            onClick={() => goTo("dashboard")}
          >
            <span>⌂</span>
            Dashboard
          </button>

          <button
            className="nav-link"
            onClick={() => goTo("containers")}
          >
            <span>▣</span>
            Containers
          </button>

          <button
            className="nav-link"
            onClick={() => goTo("timeline")}
          >
            <span>◷</span>
            Event Timeline
          </button>

          <button
            className="nav-link"
            onClick={() => goTo("locations")}
          >
            <span>⚑</span>
            Locations
          </button>

          <button
            className="nav-link"
            onClick={() => goTo("analytics")}
          >
            <span>▥</span>
            Analytics
          </button>

        </nav>

        {/* Security */}
        <div className="sidebar-label">SECURITY</div>

        <nav className="audit-nav">

          <button
            className="nav-link"
            onClick={() => goTo("audit")}
          >
            <span>◇</span>
            Audit Integrity
          </button>

          <button
            className="nav-link"
            onClick={() => goTo("alerts")}
          >
            <span>!</span>
            Alerts

            <span className="alert-count">3</span>
          </button>

        </nav>

        {/* Sidebar Bottom */}
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

        {/* Topbar */}
        <header className="audit-topbar">

          <div className="breadcrumb">
            AuditTrail
            <span>/</span>
            Dashboard
          </div>

          <div className="topbar-right">

            <button
              className="notification"
              onClick={() => goTo("alerts")}
              title="View alerts"
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

        {/* ================= CONTENT ================= */}
        <div className="audit-content">

          {/* Heading */}
          <section className="page-heading">

            <div>
              <p className="eyebrow">
                AUDITTRAIL / OVERVIEW
              </p>

              <h1>Forensic Dashboard</h1>

              <p>
                Audit and monitor your logistics events
              </p>
            </div>

            <div className="integrity-pill">
              <span>✓</span>
              Audit Integrity Verified
            </div>

          </section>

          {/* ================= STATS ================= */}
          <section className="stats-grid">

            <div className="stat-card">

              <div className="stat-card-top">
                <div className="stat-icon blue-bg">
                  ▣
                </div>

                <span className="stat-change">
                  +12%
                </span>
              </div>

              <p className="stat-label">
                TOTAL CONTAINERS
              </p>

              <h2 className="stat-number">
                24
              </h2>

              <span className="stat-description">
                Across all shipments
              </span>

            </div>

            <div className="stat-card">

              <div className="stat-card-top">
                <div className="stat-icon purple-bg">
                  ⇢
                </div>

                <span className="stat-change">
                  +8%
                </span>
              </div>

              <p className="stat-label">
                IN TRANSIT
              </p>

              <h2 className="stat-number">
                18
              </h2>

              <span className="stat-description">
                Currently moving
              </span>

            </div>

            <div className="stat-card">

              <div className="stat-card-top">
                <div className="stat-icon cyan-bg">
                  ↕
                </div>

                <span className="stat-change">
                  Live
                </span>
              </div>

              <p className="stat-label">
                ACTIVE LOCATIONS
              </p>

              <h2 className="stat-number">
                12
              </h2>

              <span className="stat-description">
                Ports & checkpoints
              </span>

            </div>

            <div className="stat-card">

              <div className="stat-card-top">
                <div className="stat-icon orange-bg">
                  !
                </div>

                <span className="stat-warning">
                  Attention
                </span>
              </div>

              <p className="stat-label">
                ACTIVE ALERTS
              </p>

              <h2 className="stat-number">
                3
              </h2>

              <span className="stat-description">
                Require review
              </span>

            </div>

          </section>

          {/* ================= QUICK ACTIONS ================= */}
          <section>

            <div className="section-title-row">

              <div>
                <h2>Quick actions</h2>
                <p>Access frequently used audit tools.</p>
              </div>

            </div>

            <div className="quick-actions">

              <button
                className="quick-action"
                onClick={() => goTo("containers")}
              >
                <div className="quick-icon blue-bg">
                  🔍
                </div>

                <div>
                  <strong>Track container</strong>
                  <span>Find shipment details</span>
                </div>

                <span className="quick-arrow">
                  →
                </span>
              </button>

              <button
                className="quick-action"
                onClick={() => goTo("timeline")}
              >
                <div className="quick-icon purple-bg">
                  ◷
                </div>

                <div>
                  <strong>View event timeline</strong>
                  <span>Review complete history</span>
                </div>

                <span className="quick-arrow">
                  →
                </span>
              </button>

              <button
                className="quick-action"
                onClick={() => goTo("audit")}
              >
                <div className="quick-icon cyan-bg">
                  ◇
                </div>

                <div>
                  <strong>Audit integrity</strong>
                  <span>Verify ledger records</span>
                </div>

                <span className="quick-arrow">
                  →
                </span>
              </button>

            </div>

          </section>

          {/* ================= TWO COLUMNS ================= */}
          <div className="dashboard-columns">

            {/* Recent Events */}
            <section className="panel">

              <div className="panel-header">

                <div>
                  <h2>Recent events</h2>
                  <p>
                    Latest activity across your shipments
                  </p>
                </div>

                <button
                  className="panel-link"
                  onClick={() => goTo("timeline")}
                >
                  View all →
                </button>

              </div>

              <div className="events-list">

                {events.map((event) => (

                  <div
                    className="event-row"
                    key={event.version}
                  >

                    <div className="event-marker"></div>

                    <div className="event-main">

                      <div className="event-title-row">

                        <strong>
                          {event.type}
                        </strong>

                        <span className="event-version">
                          {event.version}
                        </span>

                      </div>

                      <div className="event-location">
                        📍 {event.location}
                      </div>

                    </div>

                    <div className="event-right">

                      <span className="event-time">
                        {event.time}
                      </span>

                      <span
                        className={`event-status ${event.statusClass}`}
                      >
                        {event.status}
                      </span>

                    </div>

                  </div>

                ))}

              </div>

            </section>

            {/* Tracked Containers */}
            <section className="panel">

              <div className="panel-header">

                <div>
                  <h2>Tracked containers</h2>
                  <p>
                    Recently monitored shipments
                  </p>
                </div>

                <button
                  className="panel-link"
                  onClick={() => goTo("containers")}
                >
                  + Add
                </button>

              </div>

              {/* Search */}
              <div className="container-search">

                <span>⌕</span>

                <input
                  type="text"
                  placeholder="Search containers..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                />

              </div>

              <div className="container-list">

                {filteredContainers.map(
                  (container) => (

                    <div
                      className="container-row"
                      key={container.id}
                      onClick={() =>
                        goTo("containers")
                      }
                    >

                      <div className="container-box">
                        📦
                      </div>

                      <div className="container-info">

                        <strong>
                          {container.id}
                        </strong>

                        <span>
                          {container.shipment}
                        </span>

                      </div>

                      <div className="container-location">

                        <strong>
                          {container.location}
                        </strong>

                        <span
                          className={
                            container.status ===
                            "Delivered"
                              ? "delivered"
                              : ""
                          }
                        >
                          {container.status}
                        </span>

                      </div>

                    </div>

                  )
                )}

                {filteredContainers.length === 0 && (
                  <div
                    style={{
                      padding: "30px",
                      textAlign: "center",
                      color: "#8b98ad",
                    }}
                  >
                    No containers found
                  </div>
                )}

              </div>

            </section>

          </div>

          {/* ================= FOOTER ================= */}
          <footer className="dashboard-footer">

            <span>
              AuditTrail © 2026
            </span>

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