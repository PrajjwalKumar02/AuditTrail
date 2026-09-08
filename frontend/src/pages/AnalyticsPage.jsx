import React, { useState } from "react";

function AnalyticsPage({ onNavigate, onLogout }) {
  const [period, setPeriod] = useState("7D");

  const stats = [
    {
      title: "Total Containers",
      value: "1,284",
      change: "+12.4%",
      label: "vs previous period",
      icon: "▣",
    },
    {
      title: "Completed Audits",
      value: "968",
      change: "+8.7%",
      label: "vs previous period",
      icon: "✓",
    },
    {
      title: "Verified Events",
      value: "5,421",
      change: "+16.2%",
      label: "vs previous period",
      icon: "◷",
    },
    {
      title: "Integrity Score",
      value: "99.8%",
      change: "+0.4%",
      label: "system health",
      icon: "◇",
    },
  ];

  const eventData =
    period === "24H"
      ? [35, 52, 42, 68, 55, 78, 64, 82]
      : period === "30D"
      ? [42, 55, 48, 70, 62, 84, 72, 91]
      : [48, 64, 55, 78, 68, 88, 76, 95];

  const days =
    period === "30D"
      ? ["1", "5", "10", "15", "20", "25", "30", ""]
      : period === "24H"
      ? ["00", "03", "06", "09", "12", "15", "18", "21"]
      : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun", ""];

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

          <button className="nav-link active">
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
            className="nav-link"
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
          {/* HEADER */}
          <div className="page-heading">
            <div>
              <p className="eyebrow">AUDITTRAIL</p>

              <h1>Analytics</h1>

              <p>
                Monitor shipment, container and audit performance.
              </p>
            </div>

            <div className="dashboard-live">
              <span></span>
              LIVE
            </div>
          </div>

          {/* FILTER */}
          <div className="analytics-toolbar">
            <div>
              <h3>Analytics Overview</h3>
              <p>Real-time audit and shipment insights</p>
            </div>

            <div className="analytics-period">
              {["24H", "7D", "30D"].map((item) => (
                <button
                  key={item}
                  className={period === item ? "active" : ""}
                  onClick={() => setPeriod(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* STAT CARDS */}
          <div className="analytics-stats">
            {stats.map((stat) => (
              <div className="analytics-stat-card" key={stat.title}>
                <div className="analytics-stat-top">
                  <div className="analytics-stat-icon">
                    {stat.icon}
                  </div>

                  <span className="analytics-positive">
                    {stat.change}
                  </span>
                </div>

                <p>{stat.title}</p>

                <h2>{stat.value}</h2>

                <span className="analytics-muted">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

          {/* CHART + STATUS */}
          <div className="analytics-grid">
            {/* EVENT ACTIVITY */}
            <div className="panel analytics-chart-panel">
              <div className="panel-header">
                <div>
                  <h2>Event Activity</h2>
                  <p>Verified events recorded over time</p>
                </div>

                <div className="panel-status">
                  <span></span>
                  LIVE
                </div>
              </div>

              <div className="analytics-chart">
                <div className="chart-y">
                  <span>100</span>
                  <span>75</span>
                  <span>50</span>
                  <span>25</span>
                  <span>0</span>
                </div>

                <div className="chart-area">
                  <div className="chart-grid">
                    <i></i>
                    <i></i>
                    <i></i>
                    <i></i>
                    <i></i>
                  </div>

                  <div className="chart-bars">
                    {eventData.map((value, index) => (
                      <div className="chart-column" key={index}>
                        <div
                          className="chart-bar"
                          style={{ height: `${value}%` }}
                          title={`${value} events`}
                        ></div>

                        <span>{days[index]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* CONTAINER STATUS */}
            <div className="panel analytics-status-panel">
              <div className="panel-header">
                <div>
                  <h2>Container Status</h2>
                  <p>Current shipment distribution</p>
                </div>
              </div>

              <div className="status-donut">
                <div className="donut-circle">
                  <strong>1,284</strong>
                  <span>Total</span>
                </div>
              </div>

              <div className="status-list">
                <div>
                  <span>
                    <i className="status-dot-green"></i>
                    In Transit
                  </span>
                  <strong>48%</strong>
                </div>

                <div>
                  <span>
                    <i className="status-dot-blue"></i>
                    At Warehouse
                  </span>
                  <strong>22%</strong>
                </div>

                <div>
                  <span>
                    <i className="status-dot-yellow"></i>
                    Delayed
                  </span>
                  <strong>12%</strong>
                </div>

                <div>
                  <span>
                    <i className="status-dot-purple"></i>
                    Delivered
                  </span>
                  <strong>18%</strong>
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM SECTION */}
          <div className="analytics-bottom-grid">
            {/* EVENT SEVERITY */}
            <div className="panel analytics-small-panel">
              <div className="panel-header">
                <div>
                  <h2>Event Severity</h2>
                  <p>Distribution of recorded events</p>
                </div>
              </div>

              <div className="severity-item">
                <div className="severity-info">
                  <span>Verified</span>
                  <strong>5,389</strong>
                </div>

                <div className="severity-track">
                  <div
                    className="severity-fill"
                    style={{ width: "94%" }}
                  ></div>
                </div>
              </div>

              <div className="severity-item">
                <div className="severity-info">
                  <span>Warning</span>
                  <strong>28</strong>
                </div>

                <div className="severity-track">
                  <div
                    className="severity-fill warning"
                    style={{ width: "18%" }}
                  ></div>
                </div>
              </div>

              <div className="severity-item">
                <div className="severity-info">
                  <span>Critical</span>
                  <strong>4</strong>
                </div>

                <div className="severity-track">
                  <div
                    className="severity-fill critical"
                    style={{ width: "6%" }}
                  ></div>
                </div>
              </div>
            </div>

            {/* PERFORMANCE */}
            <div className="panel analytics-small-panel">
              <div className="panel-header">
                <div>
                  <h2>Shipment Performance</h2>
                  <p>Current logistics performance</p>
                </div>
              </div>

              <div className="performance-row">
                <div>
                  <span>On-time shipments</span>
                  <strong>91.6%</strong>
                </div>

                <div className="performance-bar">
                  <span style={{ width: "91.6%" }}></span>
                </div>
              </div>

              <div className="performance-row">
                <div>
                  <span>Delayed shipments</span>
                  <strong>8.4%</strong>
                </div>

                <div className="performance-bar">
                  <span style={{ width: "8.4%" }}></span>
                </div>
              </div>

              <div className="average-transit">
                <span>Average Transit Time</span>
                <strong>4.8 days</strong>
              </div>
            </div>

            {/* INTEGRITY */}
            <div className="panel analytics-small-panel">
              <div className="panel-header">
                <div>
                  <h2>Audit Integrity</h2>
                  <p>Ledger verification status</p>
                </div>

                <span className="integrity-check">✓</span>
              </div>

              <div className="integrity-score">
                <strong>99.8%</strong>
                <span>Integrity Score</span>
              </div>

              <div className="integrity-details">
                <div>
                  <span>Records Verified</span>
                  <strong>12,842</strong>
                </div>

                <div>
                  <span>Hash Verification</span>
                  <strong>100%</strong>
                </div>

                <div>
                  <span>Tampered Records</span>
                  <strong>0</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AnalyticsPage;