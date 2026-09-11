import ReplaySpeed from "./ReplaySpeed";
export default function ReplayControls({ playing, speed, currentIndex, totalEvents, onPlay, onPause, onReset, onSpeedChange }) {
  return (
    <div className="replay-controls">
      <h2>Event Replay</h2>
      <div className="replay-buttons">
        {!playing ? <button onClick={onPlay}>▶ Play</button> : <button onClick={onPause}>⏸ Pause</button>}
        <button onClick={onReset}>↻ Reset</button>
      </div>
      <p>Event {totalEvents === 0 ? 0 : currentIndex + 1} of {totalEvents}</p>
      <ReplaySpeed speed={speed} onSpeedChange={onSpeedChange} />
    </div>
  );
}