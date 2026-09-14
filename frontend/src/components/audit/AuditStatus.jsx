import IntegrityStatus from "./IntegrityStatus";
export default function AuditStatus({ audit }) {
  if (!audit) return <div className="audit-status"><h2>Audit Status</h2><p>No audit information available.</p></div>;
  return (
    <div className="audit-status">
      <h2>Audit Status</h2>
      <IntegrityStatus verified={audit.verified} />
      <div className="audit-statistics">
        <div><span>Total Events</span><strong>{audit.totalEvents}</strong></div>
        <div><span>Anomalies</span><strong>{audit.anomalies}</strong></div>
        <div><span>Last Verified</span><strong>{new Date(audit.lastVerified).toLocaleString()}</strong></div>
      </div>
    </div>
  );
}