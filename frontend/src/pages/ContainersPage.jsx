import { useState } from "react";

export default function ContainersPage({ onNavigate }) {

  const [search, setSearch] = useState("");

  const containers = [
    {
      id: "CONT-001",
      shipment: "MSC-001",
      location: "Mumbai Port",
      status: "In Transit",
      temperature: "8.4°C",
      updated: "2 minutes ago",
    },

    {
      id: "CONT-002",
      shipment: "MSC-002",
      location: "Dubai Port",
      status: "Delivered",
      temperature: "7.9°C",
      updated: "15 minutes ago",
    },

    {
      id: "CONT-003",
      shipment: "MSC-003",
      location: "Arabian Sea",
      status: "In Transit",
      temperature: "8.1°C",
      updated: "5 minutes ago",
    },

    {
      id: "CONT-004",
      shipment: "MSC-004",
      location: "Singapore Port",
      status: "In Transit",
      temperature: "8.7°C",
      updated: "8 minutes ago",
    },

    {
      id: "CONT-005",
      shipment: "MSC-005",
      location: "Warehouse-A",
      status: "Delivered",
      temperature: "7.6°C",
      updated: "25 minutes ago",
    },
  ];


  const filteredContainers = containers.filter(
    (container) =>
      container.id
        .toLowerCase()
        .includes(search.toLowerCase()) ||

      container.shipment
        .toLowerCase()
        .includes(search.toLowerCase()) ||

      container.location
        .toLowerCase()
        .includes(search.toLowerCase())
  );


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
            onClick={() =>
              onNavigate("dashboard")
            }
          >
            <span>⌂</span>
            Dashboard
          </button>


          <button
            className="nav-link active"
            onClick={() =>
              onNavigate("containers")
            }
          >
            <span>▣</span>
            Containers
          </button>


          <button
            className="nav-link"
            onClick={() =>
              onNavigate("timeline")
            }
          >
            <span>◷</span>
            Event Timeline
          </button>


          <button
            className="nav-link"
            onClick={() =>
              onNavigate("locations")
            }
          >
            <span>⚑</span>
            Locations
          </button>


          <button
            className="nav-link"
            onClick={() =>
              onNavigate("analytics")
            }
          >
            <span>▥</span>
            Analytics
          </button>

        </nav>


        <div className="sidebar-label">
          SECURITY
        </div>


        <nav className="audit-nav">

          <button
            className="nav-link"
            onClick={() =>
              onNavigate("audit")
            }
          >
            <span>◇</span>
            Audit Integrity
          </button>


          <button
            className="nav-link"
            onClick={() =>
              onNavigate("alerts")
            }
          >
            <span>!</span>
            Alerts

            <span className="alert-count">
              3
            </span>

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

              <span>
                Administrator
              </span>

            </div>


            <button
              className="logout-button"
              onClick={() => {

                localStorage.removeItem(
                  "audittrail_logged_in"
                );

                window.location.reload();

              }}
            >
              ↪
            </button>

          </div>

        </div>

      </aside>


      {/* ================= MAIN ================= */}

      <main className="audit-main">


        {/* TOP BAR */}

        <header className="audit-topbar">

          <div className="breadcrumb">

            AuditTrail

            <span>/</span>

            Containers

          </div>


          <div className="topbar-right">

            <button
              className="notification"
              onClick={() =>
                onNavigate("alerts")
              }
            >
              ♢
              <span>3</span>
            </button>


            <div className="top-user">

              <div className="top-avatar">
                A
              </div>

              <div>

                <strong>
                  Admin
                </strong>

                <span>
                  Administrator
                </span>

              </div>

            </div>

          </div>

        </header>


        {/* ================= CONTENT ================= */}

        <div className="audit-content">


          {/* PAGE HEADING */}

          <div className="page-heading">

            <div>

              <p className="eyebrow">
                AUDITTRAIL / CONTAINERS
              </p>

              <h1>
                Containers
              </h1>

              <p>
                Track and monitor all active
                shipment containers.
              </p>

            </div>


            <div className="integrity-pill">

              <span>✓</span>

              Live Tracking

            </div>

          </div>


          {/* ================= STATS ================= */}

          <div className="stats-grid">

            <div className="stat-card">

              <div className="stat-card-top">

                <div className="stat-icon blue-bg">
                  ▣
                </div>

              </div>

              <p className="stat-label">
                TOTAL CONTAINERS
              </p>

              <h2 className="stat-number">
                24
              </h2>

              <span className="stat-description">
                All tracked containers
              </span>

            </div>


            <div className="stat-card">

              <div className="stat-card-top">

                <div className="stat-icon purple-bg">
                  ⇢
                </div>

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
                  ✓
                </div>

              </div>

              <p className="stat-label">
                DELIVERED
              </p>

              <h2 className="stat-number">
                6
              </h2>

              <span className="stat-description">
                Successfully completed
              </span>

            </div>


            <div className="stat-card">

              <div className="stat-card-top">

                <div className="stat-icon orange-bg">
                  !
                </div>

              </div>

              <p className="stat-label">
                ALERTS
              </p>

              <h2 className="stat-number">
                3
              </h2>

              <span className="stat-description">
                Require attention
              </span>

            </div>

          </div>


          {/* ================= CONTAINER PANEL ================= */}

          <section className="panel">

            <div className="panel-header">

              <div>

                <h2>
                  All Containers
                </h2>

                <p>
                  Recently monitored shipments
                </p>

              </div>

            </div>


            {/* SEARCH */}

            <div className="container-search">

              <span>⌕</span>

              <input
                type="text"
                placeholder="Search by container, shipment or location..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

            </div>


            {/* TABLE HEADER */}

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "1.2fr 1fr 1.4fr 1fr 1fr",
                padding:
                  "12px 20px",
                color: "#8b98ad",
                fontSize: "12px",
                fontWeight: "700",
                textTransform:
                  "uppercase",
                letterSpacing:
                  "0.05em",
              }}
            >

              <span>Container</span>

              <span>Shipment</span>

              <span>Location</span>

              <span>Status</span>

              <span>Temperature</span>

            </div>


            {/* CONTAINERS */}

            <div className="container-list">

              {filteredContainers.map(
                (container) => (

                  <div
                    className="container-row"
                    key={container.id}
                    onClick={() => {
                      alert(
                        `${container.id}\n\nShipment: ${container.shipment}\nLocation: ${container.location}\nStatus: ${container.status}\nTemperature: ${container.temperature}`
                      );
                    }}
                    style={{
                      cursor: "pointer",
                    }}
                  >

                    <div className="container-info">

                      <strong>
                        📦 {container.id}
                      </strong>

                      <span>
                        Updated{" "}
                        {container.updated}
                      </span>

                    </div>


                    <div className="container-info">

                      <strong>
                        {container.shipment}
                      </strong>

                    </div>


                    <div className="container-location">

                      <strong>
                        {container.location}
                      </strong>

                    </div>


                    <div>

                      <span
                        className={
                          container.status ===
                          "Delivered"
                            ? "event-status verified"
                            : "event-status"
                        }
                      >
                        {container.status}
                      </span>

                    </div>


                    <div className="container-info">

                      <strong>
                        {container.temperature}
                      </strong>

                      <span>
                        Temperature
                      </span>

                    </div>

                  </div>

                )
              )}


              {filteredContainers.length ===
                0 && (

                <div
                  style={{
                    padding: "50px",
                    textAlign:
                      "center",
                    color:
                      "#8b98ad",
                  }}
                >

                  No containers found.

                </div>

              )}

            </div>

          </section>


          {/* FOOTER */}

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