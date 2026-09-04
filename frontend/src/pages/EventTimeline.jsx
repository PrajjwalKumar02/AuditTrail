const events = [
  {
    version: "v4",
    type: "ARRIVED_AT_PORT",
    location: "Mumbai Port",
    time: "14:32",
    severity: "INFO",
  },
  {
    version: "v3",
    type: "TEMPERATURE_SPIKE",
    location: "Arabian Sea",
    time: "11:20",
    severity: "WARNING",
  },
  {
    version: "v2",
    type: "LOADED_ON_SHIP",
    location: "Warehouse-A",
    time: "08:45",
    severity: "INFO",
  },
  {
    version: "v1",
    type: "CONTAINER_CREATED",
    location: "Warehouse-A",
    time: "07:10",
    severity: "INFO",
  },
];

function EventTimeline() {
  return (
    <div className="timeline">
      {events.map((event) => (
        <div className="timeline-item" key={event.version}>
          <div className="timeline-dot"></div>

          <div className="timeline-content">
            <div className="timeline-top">
              <span className="event-version">
                {event.version}
              </span>

              <span className="event-time">
                {event.time}
              </span>
            </div>

            <h3>{event.type}</h3>

            <p>📍 {event.location}</p>

            <span className={`severity ${event.severity.toLowerCase()}`}>
              {event.severity}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default EventTimeline;