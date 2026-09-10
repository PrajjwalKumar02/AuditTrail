export default function ReplaySpeed({ speed, onSpeedChange }) {
  return (
    <label>Replay Speed:{" "}
      <select value={speed} onChange={(e) => onSpeedChange(Number(e.target.value))}>
        <option value={0.5}>0.5x</option><option value={1}>1x</option><option value={2}>2x</option><option value={4}>4x</option>
      </select>
    </label>
  );
}
