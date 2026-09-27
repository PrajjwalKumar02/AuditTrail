import { useState } from "react";

function AIInsightsPage({ onNavigate, onLogout }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const insights = [
    {
      icon: "⚠",
      title: "Temperature Anomaly",
      description:
        "Container CMA-7732 has a recorded temperature of 9.8°C, which is above the expected range.",
      type: "Critical",
    },
    {
      icon: "⌖",
      title: "Location Monitoring",
      description:
        "Container HLC-5512 is being monitored because its location update is delayed.",
      type: "Warning",
    },
    {
      icon: "✓",
      title: "Audit Integrity",
      description:
        "The current demo data reports successful verification of recent ledger events.",
      type: "Verified",
    },
  ];

  const askAI = () => {
    if (!question.trim()) return;

    setLoading(true);
    setAnswer("");

    setTimeout(() => {
      const q = question.toLowerCase();

      let response =
        "This is a demo response. The AI assistant will need a real AI API connection to analyze live shipment data.";

      if (q.includes("cma-7732") || q.includes("temperature")) {
        response =
          "Container CMA-7732 has a recorded temperature of 9.8°C. This is above the expected temperature range in the demo data. Check the latest sensor readings and review the related audit events.";
      } else if (q.includes("summary") || q.includes("today")) {
        response =
          "Demo audit summary: Six ledger events are recorded. Five are classified as informational and one is a warning. The displayed integrity metric is 100%. These figures are sample data.";
      } else if (q.includes("alert")) {
        response =
          "The demo data includes a temperature warning for CMA-7732 and a delayed location update for HLC-5512. Review the alert details to investigate further.";
      } else if (q.includes("integrity") || q.includes("audit")) {
        response =
          "The demo Event Timeline displays an integrity value of 100%. This is a sample interface value and does not independently verify the blockchain ledger.";
      }

      setAnswer(response);
      setLoading(false);
    }, 900);
  };

  const logout = () => {
    localStorage.removeItem("audittrail_auth");
    localStorage.removeItem("audittrail_logged_in");
    if (onLogout) onLogout();
  };

  return (
    <div className="ai-insights-page">
      <aside className="ai-sidebar">
        <div className="ai-brand">
          <div className="ai-brand-logo">AT</div>
          <div>
            <strong>AuditTrail</strong>
            <span>FORENSIC LEDGER</span>
          </div>
        </div>

        <div className="ai-nav-title">MONITORING</div>

        <button onClick={() => onNavigate("dashboard")}>⌂ Dashboard</button>
        <button onClick={() => onNavigate("containers")}>▣ Containers</button>
        <button onClick={() => onNavigate("timeline")}>◷ Event Timeline</button>
        <button onClick={() => onNavigate("locations")}>⌖ Locations</button>
        <button onClick={() => onNavigate("analytics")}>▥ Analytics</button>

        <div className="ai-nav-title">INTELLIGENCE</div>

        <button className="ai-nav-active">✦ AI Insights</button>

        <div className="ai-nav-title">SECURITY</div>

        <button onClick={() => onNavigate("audit")}>✓ Audit Integrity</button>
        <button onClick={() => onNavigate("alerts")}>⚠ Alerts</button>

        <div className="ai-sidebar-bottom">
          <div className="ai-system-status">
            <span></span>
            System Operational
          </div>

          <button className="ai-logout" onClick={logout}>
            ⇥ Logout
          </button>
        </div>
      </aside>

      <main className="ai-main">
        <header className="ai-header">
          <div>
            <div className="ai-eyebrow">INTELLIGENT MONITORING</div>
            <h1>AI Insights</h1>
            <p>
              Explore shipment activity and review automated demo insights.
            </p>
          </div>

          <div className="ai-demo-badge">✦ AI DEMO</div>
        </header>

        <section className="ai-assistant-card">
          <div className="ai-assistant-top">
            <div className="ai-assistant-icon">✦</div>
            <div>
              <h2>AI Forensic Assistant</h2>
              <p>Ask questions about shipment activity and audit events.</p>
            </div>
          </div>

          <div className="ai-question-box">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask about containers, alerts, or audit history..."
              rows={3}
            />

            <button onClick={askAI} disabled={loading || !question.trim()}>
              {loading ? "Analyzing..." : "Ask AI →"}
            </button>
          </div>

          <div className="ai-suggestions">
            <button
              onClick={() =>
                setQuestion("Why is container CMA-7732 showing an alert?")
              }
            >
              Why is CMA-7732 showing an alert?
            </button>

            <button
              onClick={() => setQuestion("Summarize today's audit activity")}
            >
              Summarize audit activity
            </button>

            <button
              onClick={() => setQuestion("Show me the current alerts")}
            >
              Explain current alerts
            </button>
          </div>

          {loading && (
            <div className="ai-response">
              <span className="ai-response-icon">✦</span>
              <p>Reviewing demo shipment data...</p>
            </div>
          )}

          {answer && !loading && (
            <div className="ai-response">
              <div className="ai-response-heading">
                <span className="ai-response-icon">✦</span>
                <strong>Assistant Response</strong>
              </div>
              <p>{answer}</p>
            </div>
          )}
        </section>

        <section className="ai-insights-section">
          <div className="ai-section-heading">
            <div>
              <div className="ai-eyebrow">SYSTEM OVERVIEW</div>
              <h2>Automated Insights</h2>
            </div>
            <span>3 DEMO INSIGHTS</span>
          </div>

          <div className="ai-insights-grid">
            {insights.map((item, index) => (
              <article className="ai-insight-card" key={index}>
                <div className="ai-insight-top">
                  <div className="ai-insight-icon">{item.icon}</div>
                  <span
                    className={`ai-insight-status ${item.type.toLowerCase()}`}
                  >
                    {item.type}
                  </span>
                </div>

                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="ai-summary-card">
          <div>
            <div className="ai-eyebrow">LEDGER INTELLIGENCE</div>
            <h2>AI Audit Summary</h2>
            <p>
              Generate a summary of the sample audit activity using the
              assistant above.
            </p>
          </div>

          <button
            onClick={() =>
              setQuestion("Summarize today's audit activity")
            }
          >
            ✦ Generate Summary
          </button>
        </section>
      </main>
    </div>
  );
}

export default AIInsightsPage;