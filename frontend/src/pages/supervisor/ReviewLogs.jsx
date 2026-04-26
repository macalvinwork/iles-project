import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { fetchLogs, reviewLog, approveLog } from "../../services/logService";

const statusColor = {
  DRAFT: "#d97706",
  SUBMITTED: "#2563eb",
  REVIEWED: "#7c3aed",
  APPROVED: "#16a34a",
};

export default function ReviewLogs() {
  const [allLogs, setAllLogs] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState({});
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("SUBMITTED");

  useEffect(() => {
    fetchLogs()
      .then(data => {
        setAllLogs(data);
        setLogs(data.filter(l => l.status === "SUBMITTED"));
      })
      .catch(() => setError("Failed to load logs."))
      .finally(() => setLoading(false));
  }, []);

  const handleFilter = (status) => {
    setFilter(status);
    setLogs(status === "ALL" ? allLogs : allLogs.filter(l => l.status === status));
  };

  const handleReview = async (id, action) => {
    if (action === "RETURN" && !comments[id]?.trim()) {
      return alert("Please enter a comment before returning.");
    }
    setActionLoading(id + action);
    try {
      await reviewLog(id, action, comments[id] || "");
      const newStatus = action === "APPROVE" ? "REVIEWED" : "DRAFT";
      const update = prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l);
      setAllLogs(update);
      setLogs(update);
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
      const update = prev => prev.map(l => l.id === id ? { ...l, status: "APPROVED" } : l);
      setAllLogs(update);
      setLogs(update);
    } catch (err) {
      setError(err.response?.data?.error || "Approval failed.");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <Layout title="My Assigned Students Logs">
      <div style={{ display: "flex", gap: 8, marginBottom: "1rem", flexWrap: "wrap" }}>
        {["ALL", "SUBMITTED", "REVIEWED", "APPROVED", "DRAFT"].map(s => (
          <button key={s} onClick={() => handleFilter(s)}
            style={{
              padding: "0.4rem 0.9rem", borderRadius: 6,
              border: "1px solid #cbd5e1",
              background: filter === s ? "#2563eb" : "#fff",
              color: filter === s ? "#fff" : "#1e293b",
              cursor: "pointer", fontSize: "0.85rem"
            }}>
            {s}
          </button>
        ))}
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading && <p>Loading...</p>}
      {!loading && logs.length === 0 && (
        <p style={{ color: "#64748b" }}>
          {filter === "SUBMITTED"
            ? "No logs pending review. Students must submit their logs first."
            : `No logs with status ${filter}.`}
        </p>
      )}

      {logs.map(log => (
        <div key={log.id} style={{ background: "#fff", padding: "1.5rem", borderRadius: 10, marginBottom: 15, boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <h3 style={{ margin: 0 }}>Week {log.week_number}</h3>
              <p style={{ margin: "0.25rem 0 0", color: "#64748b", fontSize: "0.85rem" }}>
                Student: <strong>{log.student_name || `ID: ${log.student}`}</strong>
              </p>
              <p style={{ margin: "0.25rem 0 0", color: "#64748b", fontSize: "0.85rem" }}>
                Deadline: {log.submission_deadline?.slice(0, 10)}
                {log.submitted_at && ` | Submitted: ${log.submitted_at.slice(0, 10)}`}
              </p>
            </div>
            <span style={{ color: statusColor[log.status], fontWeight: 700, fontSize: "0.9rem" }}>
              {log.status}
            </span>
          </div>

          <h4 style={{ marginBottom: 4 }}>Activities</h4>
          <p style={{ lineHeight: 1.7, marginTop: 0 }}>{log.activities}</p>

          {log.learning_outcomes && (
            <>
              <h4 style={{ marginBottom: 4 }}>Learning Outcomes</h4>
              <p style={{ lineHeight: 1.7, marginTop: 0 }}>{log.learning_outcomes}</p>
            </>
          )}

          {log.challenges && (
            <>
              <h4 style={{ marginBottom: 4 }}>Challenges</h4>
              <p style={{ lineHeight: 1.7, marginTop: 0 }}>{log.challenges}</p>
            </>
          )}

          {log.status === "SUBMITTED" && (
            <div style={{ marginTop: "1rem" }}>
              <textarea
                placeholder="Enter comment (required to return log)"
                value={comments[log.id] || ""}
                onChange={e => setComments({ ...comments, [log.id]: e.target.value })}
                rows={2}
                style={{ width: "100%", padding: "0.6rem", borderRadius: 6, border: "1px solid #cbd5e1", boxSizing: "border-box", marginBottom: "0.75rem" }}
              />
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={() => handleReview(log.id, "APPROVE")}
                  disabled={actionLoading === log.id + "APPROVE"}
                  style={{ padding: "0.6rem 1.2rem", background: "#7c3aed", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 600 }}>
                  {actionLoading === log.id + "APPROVE" ? "Processing..." : "Mark as Reviewed"}
                </button>
                <button
                  onClick={() => handleReview(log.id, "RETURN")}
                  disabled={actionLoading === log.id + "RETURN"}
                  style={{ padding: "0.6rem 1.2rem", background: "#dc2626", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 600 }}>
                  {actionLoading === log.id + "RETURN" ? "Processing..." : "Return to Student"}
                </button>
              </div>
            </div>
          )}

          {log.status === "REVIEWED" && (
            <div style={{ marginTop: "1rem" }}>
              <button
                onClick={() => handleFinalApprove(log.id)}
                disabled={actionLoading === log.id + "FINAL"}
                style={{ padding: "0.6rem 1.2rem", background: "#16a34a", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 600 }}>
                {actionLoading === log.id + "FINAL" ? "Processing..." : "Give Final Approval"}
              </button>
            </div>
          )}

          {log.status === "APPROVED" && (
            <div style={{ marginTop: "1rem", background: "#f0fdf4", padding: "0.75rem", borderRadius: 6, borderLeft: "4px solid #16a34a" }}>
              <p style={{ margin: 0, color: "#16a34a", fontWeight: 600 }}>This log has been fully approved.</p>
            </div>
          )}
        </div>
      ))}
    </Layout>
  );
}