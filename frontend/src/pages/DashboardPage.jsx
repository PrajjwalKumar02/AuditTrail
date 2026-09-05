import React from "react";

function DashboardPage({ onNavigate, onLogout }) {
  const stats = [
    {
      icon: "◉",
      title: "Total Containers",
      value: "24",
      change: "+12%",
      changeType: "positive",
      footer: "This month",
    },
    {
      icon: "⇄",
      title: "Active Shipments",
      value: "18",
      change: "+8%",
      changeType: "positive",
      footer: "This week",
    },
    {
      icon: "⚠",
      title: "Active Alerts",
      value: "03",
      change: "-4%",
      changeType: "negative",
      footer: "This week",
    },
  ];

  const events = [
    {
      type: "ARRIVED_AT_PORT",
      location: "Mumbai Port",
      time: "14:32",
      severity: "INFO",
    },
    {
      type: "TEMPERATURE_SPIKE",
      location: "Arabian Sea",
      time: "11:20",
      severity: "WARNING",
    },
    {
      type: "LOADED_ON_SHIP",
      location: "Warehouse-A",
      time: "08:45",
      severity: "INFO",
    },
    {
      type: "CONTAINER_CREATED",
      location: "Warehouse-A",
      time: "07:10",
      severity: "INFO",
    },
  ];

  const menuItems = [
    { id: "dashboard", icon: "▦", label: "Dashboard" },
    { id: "containers", icon: "▣", label: "Containers" },
    { id: "timeline", icon: "◷", label: "Event Timeline" },
    { id: "locations", icon: "⌖", label: "Locations" },
    { id: "analytics", icon: "▥", label: "Analytics" },
    { id: "audit", icon: "✓", label: "Audit Integrity" },
    { id: "alerts", icon: "⚠", label: "Alerts" },
  ];

  return (
    <div className="audit-app">

      {/* SIDEBAR */}
      <aside className="audit-sidebar">

        <div className="audit-brand">
          <div className="audit-brand-icon">A</div>
          <div>
            <h2>AuditTrail</h2>
            <span>Forensic Ledger</span>
          </div>
        </div>

        <div className="audit-menu-label">MAIN</div>

        <nav className="audit-nav">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`audit-nav-item ${
                item.id === "dashboard" ? "active" : ""
              }`}
              onClick={() => onNavigate(item.id)}
            >
              <span className="audit-nav-icon">{item.icon}</span>
              <span>{item.label}</span>

              {item.id === "alerts" && (
                <span className="audit-alert-dot"></span>
              )}
            </button>
          ))}
        </nav>

        <div className="audit-menu-label audit-other-label">
          OTHER MENU
        </div>

        <nav className="audit-nav">
          <button className="audit-nav-item">
            <span className="audit-nav-icon">◉</span>
            Account
          </button>

          <button className="audit-nav-item">
            <span className="audit-nav-icon">⚙</span>
            Settings
          </button>

          <button className="audit-nav-item">
            <span className="audit-nav-icon">?</span>
            Help
          </button>
        </nav>

        <div className="audit-sidebar-bottom">
          <div className="audit-user">
            <div className="audit-avatar">A</div>
            <div>
              <strong>Admin</strong>
              <span>Security Analyst</span>
            </div>
          </div>

          <button className="audit-logout" onClick={onLogout}>
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="audit-main">

        {/* TOPBAR */}
        <header className="audit-topbar">
          <div className="audit-page-name">
            Dashboard
          </div>

          <div className="audit-top-actions">
            <button className="audit-icon-button">⌕</button>
            <button className="audit-icon-button">♢</button>

            <div className="audit-top-avatar">
              A
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <section className="audit-content">

          <div className="audit-heading-row">
            <div>
              <h1>Dashboard</h1>
              <p>
                Monitor container activity and verify your audit ledger.
              </p>
            </div>

            <div className="audit-live">
              <span></span>
              System Live
            </div>
          </div>

          {/* OVERVIEW */}
          <div className="audit-dashboard-grid">

            <div className="audit-overview-card">

              <div className="audit-card-top">
                <div>
                  <span className="audit-small-label">
                    OVERVIEW
                  </span>

                  <h2>Audit Activity</h2>
                </div>

                <div className="audit-overview-icon">
                  ✦
                </div>
              </div>

              <div className="audit-overview-main">

                <div className="audit-overview-number">
                  1,284
                </div>

                <span className="audit-growth">
                  ↑ 13.7%
                </span>

                <p>
                  Verified events recorded this month
                </p>
              </div>

              {/* RADAR */}
              <div className="audit-radar">

                <div className="radar-circle radar-one"></div>
                <div className="radar-circle radar-two"></div>
                <div className="radar-circle radar-three"></div>

                <div className="radar-line radar-line-one"></div>
                <div className="radar-line radar-line-two"></div>
                <div className="radar-line radar-line-three"></div>
                <div className="radar-line radar-line-four"></div>

                <div className="radar-shape">
                  <span></span>
                </div>

                <div className="radar-label radar-label-top">
                  INTEGRITY
                </div>

                <div className="radar-label radar-label-right">
                  EVENTS
                </div>

                <div className="radar-label radar-label-bottom">
                  SECURITY
                </div>

                <div className="radar-label radar-label-left">
                  TRACKING
                </div>

              </div>

              <div className="audit-location-list">

                <div>
                  <span>⌖ Mumbai Port</span>
                  <strong>420</strong>
                </div>

                <div>
                  <span>⌖ Arabian Sea</span>
                  <strong>318</strong>
                </div>

                <div>
                  <span>⌖ Dubai Port</span>
                  <strong>286</strong>
                </div>

                <div>
                  <span>⌖ Singapore Port</span>
                  <strong>174</strong>
                </div>

              </div>

            </div>

            {/* EVENT ACTIVITY */}
            <div className="audit-activity-card">

              <div className="audit-card-heading">
                <div>
                  <span className="audit-small-label">
                    THIS MONTH
                  </span>
                  <h3>Event Activity</h3>
                </div>

                <button className="audit-more">
                  ⋮
                </button>
              </div>

              <div className="audit-chart">

                <div className="chart-y-labels">
                  <span>500</span>
                  <span>400</span>
                  <span>300</span>
                  <span>200</span>
                  <span>100</span>
                  <span>0</span>
                </div>

                <div className="chart-area">

                  <div className="chart-grid-line"></div>
                  <div className="chart-grid-line"></div>
                  <div className="chart-grid-line"></div>
                  <div className="chart-grid-line"></div>
                  <div className="chart-grid-line"></div>

                  <div className="chart-bars">

                    <div className="chart-column">
                      <div
                        className="chart-bar"
                        style={{ height: "45%" }}
                      ></div>
                      <span>Jan</span>
                    </div>

                    <div className="chart-column">
                      <div
                        className="chart-bar"
                        style={{ height: "62%" }}
                      ></div>
                      <span>Feb</span>
                    </div>

                    <div className="chart-column">
                      <div
                        className="chart-bar chart-current"
                        style={{ height: "82%" }}
                      ></div>
                      <span>Mar</span>
                    </div>

                    <div className="chart-column">
                      <div
                        className="chart-bar"
                        style={{ height: "70%" }}
                      ></div>
                      <span>Apr</span>
                    </div>

                  </div>
                </div>

              </div>

              <div className="audit-chart-footer">
                <span>Verified Events</span>
                <strong>+1,235</strong>
              </div>

            </div>
          </div>

          {/* STAT CARDS */}
          <div className="audit-stats-grid">

            {stats.map((stat) => (
              <div className="audit-stat-card" key={stat.title}>

                <div className="audit-stat-header">
                  <div className="audit-stat-icon">
                    {stat.icon}
                  </div>

                  <span>{stat.title}</span>
                </div>

                <div className="audit-stat-value">
                  {stat.value}
                </div>

                <div className="audit-stat-footer">
                  <span
                    className={
                      stat.changeType === "positive"
                        ? "audit-positive"
                        : "audit-negative"
                    }
                  >
                    {stat.change}
                  </span>

                  <span>{stat.footer}</span>
                </div>

                <div className="mini-bars">
                  <i style={{ height: "35%" }}></i>
                  <i style={{ height: "55%" }}></i>
                  <i style={{ height: "42%" }}></i>
                  <i style={{ height: "75%" }}></i>
                  <i style={{ height: "60%" }}></i>
                  <i style={{ height: "88%" }}></i>
                </div>

              </div>
            ))}

          </div>

          {/* BOTTOM SECTION */}
          <div className="audit-bottom-grid">

            {/* RECENT EVENTS */}
            <div className="audit-panel">

              <div className="audit-panel-header">
                <div>
                  <span className="audit-small-label">
                    RECENT ACTIVITY
                  </span>

                  <h3>Latest Events</h3>
                </div>

                <button
                  className="audit-view-button"
                  onClick={() => onNavigate("timeline")}
                >
                  View all
                </button>
              </div>

              <div className="audit-event-list">

                {events.map((event, index) => (
                  <div className="audit-event" key={index}>

                    <div className="audit-event-dot"></div>

                    <div className="audit-event-info">
                      <strong>{event.type}</strong>

                      <span>
                        ⌖ {event.location}
                      </span>
                    </div>

                    <div className="audit-event-right">
                      <span>{event.time}</span>

                      <small
                        className={
                          event.severity === "WARNING"
                            ? "warning"
                            : ""
                        }
                      >
                        {event.severity}
                      </small>
                    </div>

                  </div>
                ))}

              </div>

            </div>

            {/* INTEGRITY */}
            <div className="audit-panel integrity-panel">

              <div className="audit-panel-header">
                <div>
                  <span className="audit-small-label">
                    SECURITY
                  </span>

                  <h3>Audit Integrity</h3>
                </div>

                <div className="integrity-check">
                  ✓
                </div>
              </div>

              <div className="integrity-score">
                <strong>100%</strong>
                <span>Verified</span>
              </div>

              <div className="integrity-progress">
                <div></div>
              </div>

              <div className="integrity-items">

                <div>
                  <span>Hash Verification</span>
                  <b>✓</b>
                </div>

                <div>
                  <span>Event Chain</span>
                  <b>✓</b>
                </div>

                <div>
                  <span>Ledger Consistency</span>
                  <b>✓</b>
                </div>

              </div>

            </div>

          </div>

        </section>
      </main>
    </div>
  );
}

export default DashboardPage;