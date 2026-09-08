import React, { useMemo, useState } from "react";

function EventTimeline({ onNavigate, onLogout }) {

  const events = [
    {
      id: 1,
      version: "v4",
      container: "CTN-48291",
      type: "CONTAINER_ARRIVED",
      description: "Container arrived at Mumbai Port.",
      location: "Mumbai Port",
      timestamp: "08 Sep 2026 • 20:42",
      relative: "2 min ago",
      severity: "INFO",
      actor: "Port Gateway",
      hash: "8f3a92d1c4e7",
    },
    {
      id: 2,
      version: "v3",
      container: "CTN-19472",
      type: "INSPECTION_COMPLETED",
      description: "Container inspection completed successfully.",
      location: "Singapore",
      timestamp: "08 Sep 2026 • 20:26",
      relative: "18 min ago",
      severity: "INFO",
      actor: "Inspection System",
      hash: "a72d91bc48f2",
    },
    {
      id: 3,
      version: "v2",
      container: "CTN-73510",
      type: "TEMPERATURE_SPIKE",
      description: "Temperature exceeded the configured threshold.",
      location: "Arabian Sea",
      timestamp: "08 Sep 2026 • 20:02",
      relative: "42 min ago",
      severity: "WARNING",
      actor: "IoT Sensor",
      hash: "d82f61a91c03",
    },
    {
      id: 4,
      version: "v7",
      container: "CTN-29183",
      type: "LOCATION_UPDATED",
      description: "Container location was updated.",
      location: "Dubai Port",
      timestamp: "08 Sep 2026 • 19:35",
      relative: "1 hr ago",
      severity: "INFO",
      actor: "GPS Tracker",
      hash: "91bc72fa31de",
    },
    {
      id: 5,
      version: "v6",
      container: "CTN-59321",
      type: "UNAUTHORIZED_CHANGE",
      description: "Unexpected container record modification detected.",
      location: "Rotterdam",
      timestamp: "08 Sep 2026 • 18:48",
      relative: "2 hrs ago",
      severity: "CRITICAL",
      actor: "Security Monitor",
      hash: "f72a91c83bd4",
    },
    {
      id: 6,
      version: "v1",
      container: "CTN-82461",
      type: "CONTAINER_CREATED",
      description: "New container record was created.",
      location: "Warehouse-A",
      timestamp: "08 Sep 2026 • 17:20",
      relative: "3 hrs ago",
      severity: "INFO",
      actor: "Admin",
      hash: "b31e72c91fa5",
    },
  ];

  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("ALL");
  const [selectedEvent, setSelectedEvent] = useState(null);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {

      const matchesSearch =
        event.container.toLowerCase().includes(search.toLowerCase()) ||
        event.type.toLowerCase().includes(search.toLowerCase()) ||
        event.location.toLowerCase().includes(search.toLowerCase()) ||
        event.actor.toLowerCase().includes(search.toLowerCase());

      const matchesSeverity =
        severityFilter === "ALL" ||
        event.severity === severityFilter;

      return matchesSearch && matchesSeverity;
    });
  }, [search, severityFilter]);

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

          <div className="page-heading timeline-heading">

            <div>

              <p className="eyebrow">
                AUDITTRAIL
              </p>

              <h1>
                Event Timeline
              </h1>

              <p>
                Chronological history of all container events.
              </p>

            </div>

            <div className="live-badge">
              <span></span>
              LIVE
            </div>

          </div>


          {/* ================= EVENT PANEL ================= */}

          <div className="panel timeline-panel">

            <div className="panel-header">

              <div>
                <h2>
                  Event Stream
                </h2>

                <p>
                  Immutable activity recorded across the ledger.
                </p>
              </div>

              <div className="timeline-count">
                {filteredEvents.length} Events
              </div>

            </div>


            {/* ================= FILTERS ================= */}

            <div className="timeline-filters">

              <div className="timeline-search">

                <span>⌕</span>

                <input
                  type="text"
                  placeholder="Search container, event, location or actor..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />

              </div>


              <select
                className="severity-filter"
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
              >
                <option value="ALL">
                  All Severity
                </option>

                <option value="INFO">
                  Info
                </option>

                <option value="WARNING">
                  Warning
                </option>

                <option value="CRITICAL">
                  Critical
                </option>
              </select>

            </div>


            {/* ================= TIMELINE ================= */}

            <div className="forensic-timeline">

              {filteredEvents.length > 0 ? (

                filteredEvents.map((event, index) => (

                  <div
                    className={`forensic-event ${
                      selectedEvent?.id === event.id
                        ? "selected-event"
                        : ""
                    }`}
                    key={event.id}
                    onClick={() => setSelectedEvent(event)}
                  >

                    <div className="timeline-line">

                      <div
                        className={`timeline-event-dot ${event.severity.toLowerCase()}`}
                      >
                        {index + 1}
                      </div>

                    </div>


                    <div className="event-card">

                      <div className="event-card-top">

                        <div className="event-main">

                          <div className="event-type-row">

                            <span className="event-version">
                              {event.version}
                            </span>

                            <h3>
                              {event.type}
                            </h3>

                          </div>

                          <p className="event-description">
                            {event.description}
                          </p>

                        </div>


                        <div className="event-time">

                          <strong>
                            {event.relative}
                          </strong>

                          <span>
                            {event.timestamp}
                          </span>

                        </div>

                      </div>


                      <div className="event-meta">

                        <span>
                          <b>Container</b>
                          {event.container}
                        </span>

                        <span>
                          <b>Location</b>
                          {event.location}
                        </span>

                        <span>
                          <b>Actor</b>
                          {event.actor}
                        </span>

                        <span
                          className={`event-severity ${event.severity.toLowerCase()}`}
                        >
                          {event.severity}
                        </span>

                      </div>

                    </div>

                  </div>

                ))

              ) : (

                <div className="timeline-empty">

                  <div>
                    ⌕
                  </div>

                  <h3>
                    No events found
                  </h3>

                  <p>
                    Try changing your search or severity filter.
                  </p>

                </div>

              )}

            </div>

          </div>


          {/* ================= EVENT DETAILS ================= */}

          {selectedEvent && (

            <div className="event-details-panel">

              <div className="details-header">

                <div>

                  <p className="eyebrow">
                    EVENT DETAILS
                  </p>

                  <h2>
                    {selectedEvent.type}
                  </h2>

                </div>

                <button
                  className="details-close"
                  onClick={() => setSelectedEvent(null)}
                >
                  ×
                </button>

              </div>


              <div className="details-grid">

                <div>
                  <span>Container</span>
                  <strong>{selectedEvent.container}</strong>
                </div>

                <div>
                  <span>Version</span>
                  <strong>{selectedEvent.version}</strong>
                </div>

                <div>
                  <span>Location</span>
                  <strong>{selectedEvent.location}</strong>
                </div>

                <div>
                  <span>Actor</span>
                  <strong>{selectedEvent.actor}</strong>
                </div>

                <div>
                  <span>Timestamp</span>
                  <strong>{selectedEvent.timestamp}</strong>
                </div>

                <div>
                  <span>Severity</span>

                  <strong
                    className={`detail-severity ${selectedEvent.severity.toLowerCase()}`}
                  >
                    {selectedEvent.severity}
                  </strong>

                </div>

              </div>


              <div className="hash-box">

                <span>
                  EVENT HASH
                </span>

                <code>
                  {selectedEvent.hash}
                </code>

                <small>
                  Cryptographic fingerprint used to verify event integrity.
                </small>

              </div>

            </div>

          )}

        </div>

      </main>

    </div>
  );
}

export default EventTimeline;