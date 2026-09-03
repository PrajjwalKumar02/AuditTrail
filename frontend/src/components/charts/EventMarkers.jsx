export default function EventMarkers({ events = [] }) {
  const important = events.filter((event) =>
    ["TEMPERATURE_SPIKE", "CONTAINER_CREATED", "LOADED_ON_SHIP", "ARRIVED_AT_PORT"].includes(event.eventType)
  );
  return (
    <div className="event-markers">
      <h3>Important Events</h3>
      {important.map((event) => (
        <div className="event-marker" key={event.version}>
          <strong>v{event.version}</strong><span>{event.eventType}</span>
        </div>
      ))}
    </div>
  );
}