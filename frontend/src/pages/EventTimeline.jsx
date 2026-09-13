import React, { useMemo, useState } from "react";

function EventTimeline({ onNavigate, onLogout }) {
  const [search, setSearch] = useState("");
  const [severity, setSeverity] = useState("ALL");
  const [selectedEvent, setSelectedEvent] = useState(null);

  const events = [
    {
      id: 6,
      version: "v6",
      container: "ATL-4821",
      type: "ARRIVED_AT_PORT",
      description: "Container arrived at Mumbai Port",
      location: "Mumbai Port",
      timestamp: "14:32",
      relative: "2 min ago",
      severity: "INFO",
      actor: "Port Gateway",
      hash: "8f3a91c2...7d21",
    },
    {
      id: 5,
      version: "v5",
      container: "ATL-4821",
      type: "TEMPERATURE_SPIKE",
      description: "Temperature exceeded the expected range",
      location: "Arabian Sea",
      timestamp: "11:20",
      relative: "3 hr ago",
      severity: "WARNING",
      actor: "IoT Sensor",
      hash: "3bc72e91...a842",
    },
    {
      id: 4,
      version: "v4",
      container: "MSC-2917",
      type: "LOADED_ON_SHIP",
      description: "Container loaded successfully onto vessel",
      location: "JNPT Terminal",
      timestamp: "08:45",
      relative: "6 hr ago",
      severity: "INFO",
      actor: "Terminal System",
      hash: "91ad72e4...bb18",
    },
    {
      id: 3,
      version: "v3",
      container: "CMA-7732",
      type: "DOCUMENT_UPDATED",
      description: "Shipment documentation was updated",
      location: "Dubai Port",
      timestamp: "07:30",
      relative: "7 hr ago",
      severity: "INFO",
      actor: "Admin",
      hash: "a82cd721...44ef",
    },
    {
      id: 2,
      version: "v2",
      container: "MAE-1048",
      type: "LOCATION_VERIFIED",
      description: "Container location successfully verified",
      location: "Rotterdam",
      timestamp: "06:15",
      relative: "8 hr ago",
      severity: "INFO",
      actor: "GPS Gateway",
      hash: "c821ad91...901a",
    },
    {
      id: 1,
      version: "v1",
      container: "ATL-4821",
      type: "CONTAINER_CREATED",
      description: "Container record created in the ledger",
      location: "Warehouse-A",
      timestamp: "07:10",
      relative: "Yesterday",
      severity: "INFO",
      actor: "System",
      hash: "f129ac82...72cd",
    },
  ];

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch =
        `${event.container} ${event.type} ${event.location} ${event.description} ${event.actor}`
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesSeverity =
        severity === "ALL" || event.severity === severity;

      return matchesSearch && matchesSeverity;
    });
  }, [search, severity]);

  const getSeverityClass = (value) => {
    if (value === "WARNING") return "timeline-warning";
    if (value === "CRITICAL") return "timeline-critical";
    return "timeline-info";
  };

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

          <button className="nav-link active">
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


      {/* ================= MAIN ================= */}

      <main className="audit-main">

        <div className="audit-content">

          {/* HEADER */}

          <div className="page-heading">

            <div>
              <p className="eyebrow">AUDITTRAIL</p>

              <h1>Event Timeline</h1>

              <p>
                Trace every event recorded in the forensic ledger.
              </p>
            </div>

            <div className="dashboard-live">
              <span></span>
              LIVE
            </div>

          </div>


          {/* SUMMARY */}

          <div className="timeline-summary">

            <div className="timeline-summary-card">
              <span>TOTAL EVENTS</span>
              <strong>{events.length}</strong>
              <small>Ledger records</small>
            </div>

            <div className="timeline-summary-card">
              <span>INFO EVENTS</span>
              <strong>
                {events.filter((e) => e.severity === "INFO").length}
              </strong>
              <small>Normal activity</small>
            </div>

            <div className="timeline-summary-card">
              <span>WARNINGS</span>
              <strong>
                {events.filter((e) => e.severity === "WARNING").length}
              </strong>
              <small>Needs attention</small>
            </div>

            <div className="timeline-summary-card">
              <span>INTEGRITY</span>
              <strong>100%</strong>
              <small>All records verified</small>
            </div>

          </div>


          {/* EVENT PANEL */}

          <div className="panel timeline-panel">

            <div className="panel-header">

              <div>
                <h2>Forensic Event Stream</h2>

                <p>
                  Chronological record of container activity
                </p>
              </div>

              <div className="panel-status">
                <span></span>
                LIVE
              </div>

            </div>


            {/* SEARCH + FILTER */}

            <div className="timeline-controls">

              <div className="timeline-search">

                <span>⌕</span>

                <input
                  type="text"
                  placeholder="Search events, containers or locations..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />

              </div>

              <div className="timeline-filters">

                {["ALL", "INFO", "WARNING", "CRITICAL"].map((item) => (

                  <button
                    key={item}
                    className={
                      severity === item
                        ? "timeline-filter active"
                        : "timeline-filter"
                    }
                    onClick={() => setSeverity(item)}
                  >
                    {item}
                  </button>

                ))}

              </div>

            </div>


            {/* EVENT LIST */}

            <div className="timeline-stream">

              {filteredEvents.length === 0 ? (

                <div className="timeline-empty">

                  <div>⌕</div>

                  <h3>No events found</h3>

                  <p>
                    Try another search or severity filter.
                  </p>

                  <button
                    onClick={() => {
                      setSearch("");
                      setSeverity("ALL");
                    }}
                  >
                    Reset Filters
                  </button>

                </div>

              ) : (

                filteredEvents.map((event, index) => (

                  <div
                    className="forensic-event"
                    key={event.id}
                    onClick={() => setSelectedEvent(event)}
                  >

                    {/* Timeline line */}

                    <div className="forensic-line">

                      <div
                        className={`forensic-dot ${getSeverityClass(
                          event.severity
                        )}`}
                      ></div>

                    </div>


                    {/* Event content */}

                    <div className="forensic-event-content">

                      <div className="forensic-event-top">

                        <div className="forensic-event-title">

                          <span className="event-version">
                            {event.version}
                          </span>

                          <h3>{event.type}</h3>

                        </div>

                        <span className="event-time">
                          {event.timestamp}
                        </span>

                      </div>


                      <p className="event-description">
                        {event.description}
                      </p>


                      <div className="event-meta">

                        <span>
                          📦 {event.container}
                        </span>

                        <span>
                          📍 {event.location}
                        </span>

                        <span>
                          ◷ {event.relative}
                        </span>

                        <span
                          className={`event-severity ${getSeverityClass(
                            event.severity
                          )}`}
                        >
                          {event.severity}
                        </span>

                      </div>

                    </div>


                    <div className="event-arrow">
                      →
                    </div>

                  </div>

                ))

              )}

            </div>

          </div>

        </div>

      </main>


      {/* ================= EVENT DETAILS ================= */}

      {selectedEvent && (

        <div
          className="event-details-overlay"
          onClick={() => setSelectedEvent(null)}
        >

          <div
            className="event-details-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="event-details-header">

              <div>

                <span>FORENSIC EVENT</span>

                <h2>{selectedEvent.type}</h2>

                <p>
                  Version {selectedEvent.version} ·{" "}
                  {selectedEvent.container}
                </p>

              </div>

              <button
                onClick={() => setSelectedEvent(null)}
              >
                ×
              </button>

            </div>


            <div className="event-detail-status">

              <span
                className={`event-severity ${getSeverityClass(
                  selectedEvent.severity
                )}`}
              >
                {selectedEvent.severity}
              </span>

              <span>
                ✓ Ledger verified
              </span>

            </div>


            <div className="event-detail-grid">

              <div>
                <span>LOCATION</span>
                <strong>📍 {selectedEvent.location}</strong>
              </div>

              <div>
                <span>TIMESTAMP</span>
                <strong>{selectedEvent.timestamp}</strong>
              </div>

              <div>
                <span>ACTOR</span>
                <strong>{selectedEvent.actor}</strong>
              </div>

              <div>
                <span>VERSION</span>
                <strong>{selectedEvent.version}</strong>
              </div>

            </div>


            <div className="event-description-box">

              <span>EVENT DESCRIPTION</span>

              <p>
                {selectedEvent.description}
              </p>

            </div>


            <div className="event-hash">

              <div>

                <span>CRYPTOGRAPHIC HASH</span>

                <strong>{selectedEvent.hash}</strong>

              </div>

              <div className="hash-verified">
                ✓ VERIFIED
              </div>

            </div>


            <div className="event-integrity">

              <div className="integrity-check-small">
                ✓
              </div>

              <div>

                <strong>Record integrity confirmed</strong>

                <p>
                  This event is linked to the immutable audit
                  chain and passed hash verification.
                </p>

              </div>

            </div>


            <button
              className="event-close-button"
              onClick={() => setSelectedEvent(null)}
            >
              Close Event
            </button>

          </div>

        </div>

      )}

    </div>
  );
}

export default EventTimeline;