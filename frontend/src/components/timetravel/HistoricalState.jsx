export default function HistoricalState({ state }) {
  if (!state) return <div className="historical-state"><h2>Historical State</h2><p>No historical state selected.</p></div>;
  const fields = [
    ["Version", `v${state.version}`], ["Timestamp", new Date(state.timestamp).toLocaleString()],
    ["Location", state.location], ["Status", state.status],
    ["Temperature", `${state.temperature}°C`], ["Event", state.eventType],
  ];
  return (
    <div className="historical-state">
      <h2>Historical State</h2>
      <div className="state-grid">{fields.map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}</div>
    </div>
  );
}
