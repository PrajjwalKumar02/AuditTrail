export default function ChartFilters({ selectedEvent, onEventChange }) {
  return (
    <div className="chart-filters">
      <label htmlFor="event-filter">Filter events</label>
      <select id="event-filter" value={selectedEvent} onChange={(e) => onEventChange(e.target.value)}>
        <option value="ALL">All Events</option>
        <option value="CONTAINER_CREATED">Container Created</option>
        <option value="LOADED_ON_SHIP">Loaded on Ship</option>
        <option value="MOVED">Moved</option>
        <option value="TEMPERATURE_SPIKE">Temperature Spike</option>
        <option value="ARRIVED_AT_PORT">Arrived at Port</option>
      </select>
    </div>
  );
}