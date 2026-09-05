import { useEffect, useState } from "react";
import { getHistoricalState } from "../../services/analyticsApi";

export default function TimeTravelSlider({ containerId = "CONTAINER-001", events = [], onStateChange }) {
  const [index, setIndex] = useState(Math.max(events.length - 1, 0));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { if (events.length) setIndex(events.length - 1); }, [events]);

  const selectedEvent = events[index];
  if (!selectedEvent) return <p>No historical events available.</p>;

  const handleChange = async (e) => {
    const newIndex = Number(e.target.value);
    setIndex(newIndex);
    setLoading(true); setError("");
    try {
      const state = await getHistoricalState(containerId, events[newIndex].timestamp);
      onStateChange?.(state);
    } catch (err) {
      setError("Unable to load historical state.");
      console.error(err);
    } finally { setLoading(false); }
  };

  return (
    <div className="time-travel">
      <h2>Time Travel</h2>
      <p>Selected time: <strong>{new Date(selectedEvent.timestamp).toLocaleString()}</strong></p>
      <input type="range" min="0" max={events.length - 1} value={index} onChange={handleChange} disabled={loading} aria-label="Historical event timeline" />
      <div className="slider-labels"><span>{new Date(events[0].timestamp).toLocaleTimeString()}</span><span>{new Date(events.at(-1).timestamp).toLocaleTimeString()}</span></div>
      {loading && <p>Loading historical state...</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}
