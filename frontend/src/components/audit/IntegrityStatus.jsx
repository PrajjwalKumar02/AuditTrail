export default function IntegrityStatus({ verified }) {
  return (
    <div className={verified ? "integrity verified" : "integrity failed"}>
      <span>{verified ? "✓" : "✕"}</span>
      <div>
        <strong>{verified ? "Integrity Verified" : "Integrity Verification Failed"}</strong>
        <p>{verified ? "The event chain passed integrity verification." : "The event chain may have been modified."}</p>
      </div>
    </div>
  );
}