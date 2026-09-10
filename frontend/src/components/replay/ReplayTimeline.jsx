export default function ReplayTimeline({ events = [], currentIndex = 0, onSelect }) {
  if (!events.length) return <p>No events available for replay.</p>;
  return (
    <div className="replay-timeline">
      {events.map((event, index) => (
        <button key={event.version} className={index === currentIndex ? "replay-event active" : "replay-event"} onClick={() => onSelect(index)}>
          <span>v{event.version}</span><strong>{event.eventType}</strong><small>{new Date(event.timestamp).toLocaleTimeString()}</small>
        </button>
      ))}
    </div>
  );
}