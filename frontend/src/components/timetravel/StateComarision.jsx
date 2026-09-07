function StateValue({ label, before, after }) {
  const changed = String(before) !== String(after);
  return (
    <div className={changed ? "state-changed" : ""}>
      <span>{label}</span>
      <div className="comparison-values">
        <div><small>Before</small><strong>{before ?? "—"}</strong></div>
        <div><small>After</small><strong>{after ?? "—"}</strong></div>
      </div>
    </div>
  );
}
export default function StateComparison({ before, after }) {
  if (!before || !after) return <div className="state-comparison"><h2>Before / After Comparison</h2><p>Select two states to compare.</p></div>;
  return (
    <div className="state-comparison">
      <h2>Before / After Comparison</h2>
      <StateValue label="Temperature" before={`${before.temperature}°C`} after={`${after.temperature}°C`} />
      <StateValue label="Location" before={before.location} after={after.location} />
      <StateValue label="Status" before={before.status} after={after.status} />
      <StateValue label="Event" before={before.eventType} after={after.eventType} />
      <StateValue label="Version" before={`v${before.version}`} after={`v${after.version}`} />
    </div>
  );
}