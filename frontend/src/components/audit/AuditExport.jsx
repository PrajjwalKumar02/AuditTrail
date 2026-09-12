import { getAuditExportUrl } from "../../services/analyticsApi";
export default function AuditExport({ containerId = "CONTAINER-001" }) {
  const handleExport = (format) => window.open(getAuditExportUrl(containerId, format), "_blank");
  return (
    <div className="audit-export">
      <h2>Audit Reports</h2>
      <p>Export audit information in the required format.</p>
      <div className="export-buttons">
        <button onClick={() => handleExport("pdf")}>Export PDF</button>
        <button onClick={() => handleExport("csv")}>Export CSV</button>
        <button onClick={() => handleExport("json")}>Export JSON</button>
      </div>
    </div>
  );
}