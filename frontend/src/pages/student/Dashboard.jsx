import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import { fetchLogs } from "../../services/logService";
import { fetchDashboard } from "../../services/userService";

export default function StudentDashboard() {
  const [data, setData] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([fetchDashboard(), fetchLogs()])
      .then(([dash, logsData]) => {
        setData(dash);
        setLogs(logsData);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const pending = logs.filter(l =>
    l.status === "PENDING_WORK_APPROVAL" || l.status === "RESUBMITTED"
  ).length;

  const returned = logs.filter(l => l.status === "RETURNED").length;
  const completed = logs.filter(l => l.status === "COMPLETED").length;
  const total = logs.length;

  const cards = [
    { label: "Placement", value: data?.placement || "Not assigned", color: "#2563eb" },
    { label: "Total Logs", value: total, color: "#7c3aed" },
    { label: "Pending Review", value: pending, color: "#d97706" },
    { label: "Returned", value: returned, color: "#dc2626" },
    { label: "Completed", value: completed, color: "#16a34a" },
  ];

  return (
    <Layout title="Student Dashboard">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }}>
        {cards.map(c => (
          <div key={c.label} style={{ background: "#fff", padding: "1.25rem", borderRadius: 10, borderLeft: `4px solid ${c.color}` }}>
            <p style={{ margin: 0, color: "#64748b", fontSize: "0.8rem" }}>{c.label}</p>
            <h2 style={{ margin: "0.25rem 0 0", color: c.color, fontSize: "1.5rem" }}>
              {loading ? "..." : c.value}
            </h2>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "1.5rem", background: "#fff", padding: "1.5rem", borderRadius: 10 }}>
        <h3 style={{ marginTop: 0 }}>Quick Actions</h3>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => navigate("/student/logs/create")} style={btn("#2563eb")}>+ Create New Log</button>
          <button onClick={() => navigate("/student/logs")} style={btn("#475569")}>View My Logs</button>
          <button onClick={() => navigate("/student/placement")} style={btn("#7c3aed")}>My Placement</button>
        </div>
      </div>

      <div style={{ marginTop: "1.5rem", background: "#fff", padding: "1.5rem", borderRadius: 10 }}>
        <h3 style={{ marginTop: 0 }}>Recent Logs</h3>
        {loading && <p>Loading...</p>}
        {!loading && logs.length === 0 && <p style={{ color: "#64748b" }}>No logs yet. Create your first log above.</p>}
        {logs.slice(0, 5).map(log => (
          <div key={log.id} onClick={() => navigate(`/student/logs/${log.id}`)}
            style={{ padding: "0.75rem 0", borderBottom: "1px solid #f1f5f9", cursor: "pointer", display: "flex", justifyContent: "space-between" }}>
            <div>
              <strong>Week {log.week_number}</strong>
              <p style={{ margin: "0.25rem 0 0", color: "#64748b", fontSize: "0.85rem" }}>
                {log.placement_company} | {log.submitted_at?.slice(0, 10) || "Draft"}
              </p>
            </div>
            <span style={{ color: statusColor[log.status] || "#64748b", fontWeight: 600, fontSize: "0.85rem" }}>
              {log.status}
            </span>
          </div>
        ))}
      </div>
    </Layout>
  );
}

const btn = bg => ({ padding: "0.6rem 1.2rem", background: bg, color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 600 });

const statusColor = {
  DRAFT: "#d97706",
  PENDING_WORK_APPROVAL: "#2563eb",
  RESUBMITTED: "#7c3aed",
  RETURNED: "#dc2626",
  PENDING_ACADEMIC_EVALUATION: "#0891b2",
  COMPLETED: "#16a34a",
};