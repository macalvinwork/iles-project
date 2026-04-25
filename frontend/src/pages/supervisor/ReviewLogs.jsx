import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { fetchLogs, reviewLog, approveLog } from "../../services/logService";

const statusColor = { DRAFT: "#d97706", SUBMITTED: "#2563eb", REVIEWED: "#7c3aed", APPROVED: "#16a34a" };

export default function ReviewLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState({});
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchLogs()
      .then(data => {
        const reviewable = data.filter(l => l.status === "SUBMITTED" || l.status === "REVIEWED");
        setLogs(reviewable);
      })
      .catch(() => setError("Failed to load logs."))
      .finally(() => setLoading(false));
  }, []);

  const handleReview = async (id, action) => {
    if (action === "RETURN" && !comments[id]?.trim()) {
      return alert("Please enter a comment before returning.");
    }
    setActionLoading(id + action);
    try {
      await reviewLog(id, action, comments[id] || "");
      setLogs(prev => prev.map(l =>
        l.id === id ? { ...l, status: action === "APPROVE" ? "REVIEWED" : "DRAFT" } : l
      ));
    } catch (err) {
      setError(err.response?.data?.error || "Action failed.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleFinalApprove = async (id) => {
    setActionLoading(id + "FINAL");
    try {
      await approveLog(id);
      setLogs(prev => prev.map(l => l.id === id ? { ...l, status: "APPROVED" } : l));
    } catch (err) {
      setError(err.response?.data?.error || "Approval failed.");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <Layout title="Review Student Logs">
      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading && <p>Loading...</p>}
      {!loading && logs.length === 0 && (
        <p style={{ color: "#64748b" }}>No logs to review yet. Students must submit their draft logs first.</p>
      )}
      {logs.map(log => (
        <div key={log.id} style={{ background: "#fff", padding: "1.5rem", borderRadius: 10, marginBottom: 15, boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h3 style={{ margin: 0 }}>Week {log.week_number} — {log.student}</h3>
            <span style={{ color: statusColor[log.status], fontWeight: 600 }}>{log.status}</span>
          </div>
          <p style={{ color: "#64748b", fontSize: "0.85rem" }}>
            Deadline: {log.submission_deadline?.slice(0, 10)}
          </p>
          <p style={{ lineHeight: 1.6 }}>{log.activities}</p>

          <textarea
            placeholder="Enter comment (required to return)"
            value={comments[log.id] || ""}
            onChange={e => setComments({ ...comments, [log.id]: e.target.value })}
            rows={2}
            style={{ width: "100%", padding: "0.6rem", borderRadius: 6, border: "1px solid #cbd5e1", boxSizing: "border-box", marginBottom: "0.75rem" }}
          />

          <div style={{ display: "flex", gap: 10 }}>
            {log.status === "SUBMITTED" && (
              <>
                <button
                  onClick={() => handleReview(log.id, "APPROVE")}
                  disabled={actionLoading === log.id + "APPROVE"}
                  style={{ padding: "0.6rem 1.2rem", background: "#7c3aed", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}>
                  {actionLoading === log.id + "APPROVE" ? "..." : "Mark Reviewed"}
                </button>
                <button
                  onClick={() => handleReview(log.id, "RETURN")}
                  disabled={actionLoading === log.id + "RETURN"}
                  style={{ padding: "0.6rem 1.2rem", background: "#dc2626", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}>
                  {actionLoading === log.id + "RETURN" ? "..." : "Return"}
                </button>
              </>
            )}
            {log.status === "REVIEWED" && (
              <button
                onClick={() => handleFinalApprove(log.id)}
                disabled={actionLoading === log.id + "FINAL"}
                style={{ padding: "0.6rem 1.2rem", background: "#16a34a", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}>
                {actionLoading === log.id + "FINAL" ? "..." : "Final Approve"}
              </button>
            )}
          </div>
        </div>
      ))}
    </Layout>
  );
}