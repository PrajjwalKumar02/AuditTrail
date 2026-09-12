import React, { useState } from "react";

function AnalyticsPage({ onNavigate, onLogout }) {
  const [selectedStatus, setSelectedStatus] = useState("All");

  const statusData = [
    { name: "In Transit", count: 624 },
    { name: "At Warehouse", count: 318 },
    { name: "Delivered", count: 286 },
    { name: "Alert", count: 56 },
  ];

  const totalContainers = statusData.reduce(
    (total, item) => total + item.count,
    0
  );

  const handleStatusClick = (status) => {
    setSelectedStatus(status);
  };

  const selectedCount =
    selectedStatus === "All"
      ? totalContainers
      : statusData.find((item) => item.name === selectedStatus)?.count || 0;

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

          <button className="nav-link active">
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

      {/* MAIN CONTENT */}
      <main className="audit-main">
        <div className="audit-content">

          {/* HEADER */}
          <div className="page-heading">
            <div>
              <p className="eyebrow">AUDITTRAIL</p>

              <h1>Analytics</h1>

              <p>
                Monitor shipment and audit performance analytics.
              </p>
            </div>

            <div className="dashboard-live">
              <span></span>
              LIVE
            </div>
          </div>

          {/* STAT CARDS */}
          <div className="analytics-stats">

            <div className="analytics-stat-card">
              <span>TOTAL CONTAINERS</span>
              <strong>{totalContainers.toLocaleString()}</strong>
              <small>+12.4% from last month</small>
            </div>

            <div className="analytics-stat-card">
              <span>COMPLETED AUDITS</span>
              <strong>968</strong>
              <small>+8.7% from last month</small>
            </div>

            <div className="analytics-stat-card">
              <span>VERIFIED EVENTS</span>
              <strong>5,421</strong>
              <small>+16.2% from last month</small>
            </div>

            <div className="analytics-stat-card">
              <span>INTEGRITY SCORE</span>
              <strong className="analytics-safe">
                99.8%
              </strong>
              <small>+0.4% improvement</small>
            </div>

          </div>

          {/* PERFORMANCE PANEL */}
          <div className="panel analytics-panel">

            <div className="panel-header">
              <div>
                <h2>Audit Performance</h2>

                <p>
                  Overview of recent audit activity
                </p>
              </div>

              <div className="panel-status">
                <span></span>
                ACTIVE
              </div>
            </div>

            <div className="analytics-performance">

              <div className="performance-item">
                <div>
                  <strong>Audit Completion</strong>
                  <span>
                    968 of 1,024 audits completed
                  </span>
                </div>

                <b>94.5%</b>
              </div>

              <div className="analytics-bar">
                <div style={{ width: "94.5%" }}></div>
              </div>

              <div className="performance-item">
                <div>
                  <strong>Event Verification</strong>
                  <span>
                    5,421 events successfully verified
                  </span>
                </div>

                <b>100%</b>
              </div>

              <div className="analytics-bar">
                <div style={{ width: "100%" }}></div>
              </div>

              <div className="performance-item">
                <div>
                  <strong>Ledger Integrity</strong>
                  <span>
                    No tampered records detected
                  </span>
                </div>

                <b className="analytics-safe">
                  99.8%
                </b>
              </div>

              <div className="analytics-bar">
                <div style={{ width: "99.8%" }}></div>
              </div>

            </div>
          </div>

          {/* TWO PANELS */}
          <div className="analytics-grid">

            {/* CONTAINER STATUS */}
            <div className="panel analytics-mini-panel">

              <div className="panel-header">
                <div>
                  <h2>Container Status</h2>

                  <p>
                    Current shipment distribution
                  </p>
                </div>

                <button
                  onClick={() => setSelectedStatus("All")}
                  style={{
                    border: "none",
                    background: "transparent",
                    color:
                      selectedStatus === "All"
                        ? "inherit"
                        : "#a78bfa",
                    cursor: "pointer",
                    fontSize: "12px",
                  }}
                >
                  {selectedStatus === "All"
                    ? "ALL"
                    : "RESET"}
                </button>
              </div>

              {/* SELECTED STATUS */}
              <div
                style={{
                  marginBottom: "18px",
                  padding: "12px 14px",
                  borderRadius: "10px",
                  background: "rgba(139, 92, 246, 0.08)",
                  border: "1px solid rgba(139, 92, 246, 0.18)",
                }}
              >
                <small
                  style={{
                    display: "block",
                    opacity: 0.6,
                    fontSize: "10px",
                    marginBottom: "4px",
                  }}
                >
                  SELECTED STATUS
                </small>

                <strong>
                  {selectedStatus}
                </strong>

                <span
                  style={{
                    float: "right",
                    fontWeight: "700",
                  }}
                >
                  {selectedCount.toLocaleString()}
                </span>
              </div>

              <div className="analytics-status-list">

                {statusData.map((item) => (
                  <div
                    key={item.name}
                    onClick={() =>
                      handleStatusClick(item.name)
                    }
                    style={{
                      cursor: "pointer",
                      borderRadius: "10px",
                      padding: "10px",
                      transition: "0.2s",
                      background:
                        selectedStatus === item.name
                          ? "rgba(139, 92, 246, 0.10)"
                          : "transparent",
                    }}
                  >
                    <span className="status-dot"></span>

                    <strong>{item.name}</strong>

                    <b>{item.count}</b>
                  </div>
                ))}

              </div>
            </div>

            {/* RECENT ACTIVITY */}
            <div className="panel analytics-mini-panel">

              <div className="panel-header">
                <div>
                  <h2>Recent Activity</h2>

                  <p>
                    Latest analytics updates
                  </p>
                </div>
              </div>

              <div className="analytics-activity">

                <div>
                  <strong>
                    Audit verification completed
                  </strong>

                  <span>2 min ago</span>
                </div>

                <div>
                  <strong>
                    128 container records synchronized
                  </strong>

                  <span>8 min ago</span>
                </div>

                <div>
                  <strong>
                    Integrity score updated
                  </strong>

                  <span>14 min ago</span>
                </div>

                <div>
                  <strong>
                    Shipment analytics refreshed
                  </strong>

                  <span>21 min ago</span>
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