import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import { fetchLogs, deleteLog } from "../../services/logService";

const statusColor = {
  DRAFT: "#d97706",
  SUBMITTED: "#2563eb",
  REVIEWED: "#7c3aed",
  APPROVED: "#16a34a",
};

export default function Logs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchLogs()
      .then(setLogs)
      .catch(() => setError("Failed to load logs."))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Delete this draft log?")) return;
    try {
      await deleteLog(id);
      setLogs(logs.filter(l => l.id !== id));
    } catch {
      alert("Failed to delete log.");
    }
  };

  return (
    <Layout title="My Weekly Logs">
      <button
        onClick={() => navigate("/student/logs/create")}
        style={{ padding: "0.6rem 1.2rem", background: "#2563eb", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 600, marginBottom: "1rem" }}>
        + Create New Log
      </button>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && logs.length === 0 && <p>No logs yet. Create your first log above.</p>}

      <div>
        {logs.map(log => (
          <div
            key={log.id}
            onClick={() => navigate(`/student/logs/${log.id}`)}
            style={{ background: "#fff", padding: "1rem 1.25rem", borderRadius: 8, marginBottom: 10, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
          >
            <div>
              <strong>Week {log.week_number}</strong>
              <p style={{ margin: "0.25rem 0 0", color: "#64748b", fontSize: "0.85rem" }}>
                {log.status === "DRAFT"
                  ? "Draft — click to open and submit"
                  : `Submitted: ${log.submitted_at?.slice(0, 10)}`}
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ color: statusColor[log.status] || "#64748b", fontWeight: 600 }}>
                {log.status}
              </span>
              {log.status === "DRAFT" && (
                <button
                  onClick={(e) => handleDelete(e, log.id)}
                  style={{ padding: "0.3rem 0.7rem", background: "#dc2626", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: "0.8rem" }}>
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}