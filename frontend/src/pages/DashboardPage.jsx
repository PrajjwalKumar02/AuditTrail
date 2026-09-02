import { useState } from "react";

function DashboardPage({ onLogout }) {
  const [search, setSearch] = useState("");

  const events = [
    {
      version: "v4",
      type: "ARRIVED_AT_PORT",
      location: "Mumbai Port",
      time: "14:32",
      status: "Verified",
      level: "info",
    },
    {
      version: "v3",
      type: "TEMPERATURE_SPIKE",
      location: "Arabian Sea",
      time: "11:20",
      status: "Warning",
      level: "warning",
    },
    {
      version: "v2",
      type: "LOADED_ON_SHIP",
      location: "Warehouse-A",
      time: "08:45",
      status: "Verified",
      level: "info",
    },
    {
      version: "v1",
      type: "CONTAINER_CREATED",
      location: "Warehouse-A",
      time: "07:10",
      status: "Verified",
      level: "info",
    },
  ];

  const containers = [
    {
      id: "CONT-001",
      shipment: "MSC-001",
      status: "In Transit",
      location: "Mumbai Port",
    },
    {
      id: "CONT-002",
      shipment: "MSC-002",
      status: "Delivered",
      location: "Dubai Port",
    },
    {
      id: "CONT-003",
      shipment: "MSC-003",
      status: "In Transit",
      location: "Arabian Sea",
    },
  ];

  const filteredContainers = containers.filter((container) =>
    `${container.id} ${container.shipment} ${container.location}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

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

          <a className="nav-link active" href="#dashboard">
            <span>⌂</span>
            Dashboard
          </a>

          <a className="nav-link" href="#containers">
            <span>▣</span>
            Containers
          </a>

          <a className="nav-link" href="#timeline">
            <span>◷</span>
            Event Timeline
          </a>

          <a className="nav-link" href="#locations">
            <span>⌖</span>
            Locations
          </a>

          <a className="nav-link" href="#analytics">
            <span>▥</span>
            Analytics
          </a>

          <div className="sidebar-label second">
            SECURITY
          </div>

          <a className="nav-link" href="#audit">
            <span>♢</span>
            Audit Integrity
          </a>

          <a className="nav-link" href="#alerts">
            <span>!</span>
            Alerts
            <span className="alert-count">3</span>
          </a>

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


      {/* MAIN */}
      <main className="audit-main">

        {/* TOPBAR */}
        <header className="audit-topbar">

          <div className="breadcrumb">
            Workspace
            <span>/</span>
            <strong>Dashboard</strong>
          </div>

          <div className="topbar-right">

            <div className="notification">
              ♢
              <span></span>
            </div>

            <div className="top-user">
              <div className="top-avatar">
                A
              </div>

              <div>
                <strong>Admin</strong>
                <small>Administrator</small>
              </div>

              <span className="chevron">⌄</span>
            </div>

          </div>

        </header>


        {/* CONTENT */}
        <section className="audit-content">

          {/* HEADER */}
          <div className="page-heading">

            <div>
              <div className="eyebrow">
                OVERVIEW
              </div>

              <h1>
                Welcome back, Admin <span>👋</span>
              </h1>

              <p>
                Here's what's happening with your logistics and audit events.
              </p>
            </div>

            <div className="integrity-pill">
              <span></span>
              Audit system verified
            </div>

          </div>


          {/* STATS */}
          <div className="stats-grid">

            <div className="stat-card">

              <div className="stat-top">
                <div className="stat-icon blue">▣</div>

                <span className="stat-change">
                  +12%
                </span>
              </div>

              <span className="stat-label">
                TOTAL CONTAINERS
              </span>

              <strong className="stat-number">
                24
              </strong>

              <p>
                Across all shipments
              </p>

            </div>


            <div className="stat-card">

              <div className="stat-top">
                <div className="stat-icon purple">⇢</div>

                <span className="stat-change">
                  +8%
                </span>
              </div>

              <span className="stat-label">
                IN TRANSIT
              </span>

              <strong className="stat-number">
                18
              </strong>

              <p>
                Currently moving
              </p>

            </div>


            <div className="stat-card">

              <div className="stat-top">
                <div className="stat-icon cyan">⌖</div>

                <span className="stat-change">
                  Live
                </span>
              </div>

              <span className="stat-label">
                ACTIVE LOCATIONS
              </span>

              <strong className="stat-number">
                12
              </strong>

              <p>
                Ports & checkpoints
              </p>

            </div>


            <div className="stat-card">

              <div className="stat-top">
                <div className="stat-icon orange">!</div>

                <span className="stat-warning">
                  Attention
                </span>
              </div>

              <span className="stat-label">
                ACTIVE ALERTS
              </span>

              <strong className="stat-number">
                3
              </strong>

              <p>
                Require review
              </p>

            </div>

          </div>


          {/* QUICK ACTIONS */}
          <div className="section-title-row">

            <div>
              <h2>Quick actions</h2>
              <p>Access frequently used audit tools.</p>
            </div>

          </div>


          <div className="quick-actions">

            <button className="quick-action">
              <div className="quick-icon blue-bg">
                🔍
              </div>

              <div>
                <strong>Track container</strong>
                <span>Find shipment details</span>
              </div>

              <b>→</b>
            </button>


            <button className="quick-action">
              <div className="quick-icon purple-bg">
                ◷
              </div>

              <div>
                <strong>View event timeline</strong>
                <span>Review complete history</span>
              </div>

              <b>→</b>
            </button>


            <button className="quick-action">
              <div className="quick-icon cyan-bg">
                ♢
              </div>

              <div>
                <strong>Audit integrity</strong>
                <span>Verify ledger records</span>
              </div>

              <b>→</b>
            </button>

          </div>


          {/* LOWER GRID */}
          <div className="dashboard-columns">

            {/* RECENT EVENTS */}
            <section className="panel events-panel" id="timeline">

              <div className="panel-header">

                <div>
                  <h2>Recent events</h2>
                  <p>Latest activity across your shipments</p>
                </div>

                <button className="view-all">
                  View all →
                </button>

              </div>


              <div className="event-list">

                {events.map((event) => (
                  <div
                    className="event-row"
                    key={event.version}
                  >

                    <div className={`event-marker ${event.level}`}>
                      ●
                    </div>

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
                        className={`event-status ${event.level}`}
                      >
                        {event.status}
                      </span>

                    </div>

                  </div>
                ))}

              </div>

            </section>


            {/* CONTAINERS */}
            <section className="panel containers-panel" id="containers">

              <div className="panel-header">

                <div>
                  <h2>Tracked containers</h2>
                  <p>Recently monitored shipments</p>
                </div>

                <button className="add-button">
                  + Add
                </button>

              </div>


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

                {filteredContainers.map((container) => (
                  <div
                    className="container-row"
                    key={container.id}
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
                      <span>
                        {container.location}
                      </span>

                      <small>
                        {container.status}
                      </small>
                    </div>

                  </div>
                ))}

              </div>

            </section>

          </div>


          {/* FOOTER */}
          <div className="dashboard-footer">

            <span>
              AuditTrail © 2026
            </span>

            <span>
              Last synchronized just now
            </span>

            <span className="footer-secure">
              🔐 Secure ledger
            </span>

          </div>

        </section>

      </main>

    </div>
  );
}

export default DashboardPage;