import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import { fetchDashboard } from "../../services/userService";
import { fetchEvaluations, fetchCriteria, submitEvaluation } from "../../services/evaluationService";
import { fetchPlacements } from "../../services/placementService";
import { fetchLogs } from "../../services/logService";

export default function AcademicDashboard() {
  const [data, setData] = useState(null);
  const [logs, setLogs] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
  const [criteria, setCriteria] = useState([]);
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEvalForm, setShowEvalForm] = useState(false);
  const [selectedPlacement, setSelectedPlacement] = useState("");
  const [scores, setScores] = useState({});
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [evalError, setEvalError] = useState("");
  const [evalSuccess, setEvalSuccess] = useState("");
  const [activeTab, setActiveTab] = useState("logs");
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      fetchDashboard(),
      fetchLogs(),
      fetchEvaluations(),
      fetchCriteria(),
      fetchPlacements()
    ])
      .then(([dash, logsData, evals, crit, plac]) => {
        setData(dash);
        setLogs(logsData);
        setEvaluations(evals);
        setCriteria(crit.filter(c => c.is_active));
        setPlacements(plac);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const total = criteria.reduce((sum, c) => {
    return sum + ((Number(scores[c.id]) || 0) * (c.weight / 100));
  }, 0);

  const handleEvalSubmit = async (e) => {
    e.preventDefault();
    setEvalError(""); setEvalSuccess(""); setSubmitting(true);
    const selectedP = placements.find(p => p.id === parseInt(selectedPlacement));
    try {
      const newEval = await submitEvaluation({
        student: selectedP?.student,
        placement: selectedPlacement,
        scores,
        notes,
      });
      setEvaluations([...evaluations, newEval]);
      setEvalSuccess("Evaluation submitted successfully.");
      setShowEvalForm(false);
      setSelectedPlacement("");
      setScores({});
      setNotes("");
    } catch (err) {
      const errors = err.response?.data;
      setEvalError(typeof errors === "object" ? JSON.stringify(errors) : "Failed to submit.");
    } finally {
      setSubmitting(false);
    }
  };

  const statusColor = {
    DRAFT: "#d97706", SUBMITTED: "#2563eb",
    REVIEWED: "#7c3aed", APPROVED: "#16a34a"
  };

  return (
    <Layout title="Academic Supervisor Dashboard">
      <div style={{ background: "#fff", padding: "1.25rem", borderRadius: 10, borderLeft: "4px solid #2563eb", maxWidth: 300, marginBottom: "1.5rem" }}>
        <p style={{ margin: 0, color: "#64748b" }}>Total Evaluations</p>
        <h2 style={{ margin: "0.25rem 0 0", color: "#2563eb" }}>{loading ? "..." : data?.total_evaluations}</h2>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: "1.5rem", flexWrap: "wrap" }}>
        <button onClick={() => setActiveTab("logs")}
          style={{ padding: "0.6rem 1.2rem", background: activeTab === "logs" ? "#2563eb" : "#fff", color: activeTab === "logs" ? "#fff" : "#1e293b", border: "1px solid #cbd5e1", borderRadius: 6, cursor: "pointer", fontWeight: 600 }}>
          View Student Logs
        </button>
        <button onClick={() => setActiveTab("evaluations")}
          style={{ padding: "0.6rem 1.2rem", background: activeTab === "evaluations" ? "#2563eb" : "#fff", color: activeTab === "evaluations" ? "#fff" : "#1e293b", border: "1px solid #cbd5e1", borderRadius: 6, cursor: "pointer", fontWeight: 600 }}>
          View Evaluations
        </button>
        <button onClick={() => { setActiveTab("evaluate"); setShowEvalForm(true); }}
          style={{ padding: "0.6rem 1.2rem", background: "#16a34a", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 600 }}>
          + New Evaluation
        </button>
      </div>

      {activeTab === "logs" && (
        <div style={{ background: "#fff", padding: "1.5rem", borderRadius: 10 }}>
          <h3 style={{ marginTop: 0 }}>Student Logs</h3>
          {loading && <p>Loading...</p>}
          {!loading && logs.length === 0 && <p style={{ color: "#64748b" }}>No logs submitted yet.</p>}
          {logs.map(log => (
            <div key={log.id} style={{ padding: "1rem", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <strong>Week {log.week_number}</strong>
                <p style={{ margin: "0.25rem 0 0", color: "#64748b", fontSize: "0.85rem" }}>
                  Student: {log.student_name || `ID: ${log.student}`}
                </p>
                <p style={{ margin: "0.25rem 0 0", color: "#64748b", fontSize: "0.85rem" }}>
                  {log.submitted_at ? `Submitted: ${log.submitted_at.slice(0, 10)}` : `Created: ${log.created_at?.slice(0, 10)}`}
                </p>
                <p style={{ margin: "0.5rem 0 0", lineHeight: 1.6, color: "#374151", fontSize: "0.9rem" }}>
                  {log.activities?.slice(0, 150)}{log.activities?.length > 150 ? "..." : ""}
                </p>
              </div>
              <span style={{ color: statusColor[log.status], fontWeight: 700, marginLeft: 15 }}>
                {log.status}
              </span>
            </div>
          ))}
        </div>
      )}

      {activeTab === "evaluations" && (
        <div style={{ background: "#fff", padding: "1.5rem", borderRadius: 10 }}>
          <h3 style={{ marginTop: 0 }}>Submitted Evaluations</h3>
          {loading && <p>Loading...</p>}
          {!loading && evaluations.length === 0 && <p style={{ color: "#64748b" }}>No evaluations submitted yet.</p>}
          {evaluations.map(e => (
            <div key={e.id} style={{ padding: "0.75rem 0", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <strong>{e.student_name}</strong>
                <p style={{ margin: "0.25rem 0 0", color: "#64748b", fontSize: "0.85rem" }}>
                  Submitted: {e.submitted_at?.slice(0, 10)}
                </p>
                {e.notes && <p style={{ margin: "0.25rem 0 0", color: "#64748b", fontSize: "0.85rem" }}>Notes: {e.notes}</p>}
              </div>
              <span style={{ fontSize: "1.25rem", fontWeight: 700, color: e.total_score >= 70 ? "#16a34a" : "#dc2626" }}>
                {e.total_score} / 100
              </span>
            </div>
          ))}
        </div>
      )}

      {activeTab === "evaluate" && (
        <div style={{ background: "#fff", padding: "1.5rem", borderRadius: 10 }}>
          <h3 style={{ marginTop: 0 }}>Submit New Evaluation</h3>
          {evalError && <p style={{ color: "red" }}>{evalError}</p>}
          {evalSuccess && <p style={{ color: "#16a34a", fontWeight: 600 }}>{evalSuccess}</p>}

          {criteria.length === 0 && (
            <p style={{ color: "#d97706" }}>No evaluation criteria found. Ask admin to add criteria in Django admin first.</p>
          )}

          <form onSubmit={handleEvalSubmit}>
            <label style={lbl}>Placement (Student)</label>
            <select value={selectedPlacement} onChange={e => setSelectedPlacement(e.target.value)} required style={inp}>
              <option value="">-- Select placement --</option>
              {placements.map(p => (
                <option key={p.id} value={p.id}>{p.company_name} — Student ID: {p.student}</option>
              ))}
            </select>

            {criteria.map(c => (
              <div key={c.id} style={{ marginBottom: "1rem" }}>
                <label style={lbl}>
                  {c.name} <span style={{ color: "#64748b", fontWeight: 400 }}>({c.weight}% weight, max 100)</span>
                </label>
                <input
                  type="number" min={0} max={100}
                  value={scores[c.id] || ""}
                  onChange={e => setScores({ ...scores, [c.id]: e.target.value })}
                  required style={inp}
                />
              </div>
            ))}

            {criteria.length > 0 && (
              <div style={{ background: "#f1f5f9", padding: "1rem", borderRadius: 8, marginBottom: "1rem", textAlign: "center" }}>
                <strong>Total Score:</strong>
                <span style={{ fontSize: "1.5rem", fontWeight: 700, marginLeft: 10, color: total >= 70 ? "#16a34a" : "#dc2626" }}>
                  {total.toFixed(2)} / 100
                </span>
              </div>
            )}

            <label style={lbl}>Notes</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={3}
              style={{ ...inp, resize: "vertical" }}
              placeholder="Any additional comments about the student..."
            />

            <div style={{ display: "flex", gap: 10 }}>
              <button type="submit" disabled={submitting}
                style={{ padding: "0.75rem 1.5rem", background: "#2563eb", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 600 }}>
                {submitting ? "Submitting..." : "Submit Evaluation"}
              </button>
              <button type="button" onClick={() => setActiveTab("evaluations")}
                style={{ padding: "0.75rem 1.5rem", background: "#fff", color: "#64748b", border: "1px solid #cbd5e1", borderRadius: 6, cursor: "pointer" }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </Layout>
  );
}

const lbl = { display: "block", fontWeight: 600, marginBottom: 4, fontSize: "0.875rem" };
const inp = { display: "block", width: "100%", padding: "0.6rem", marginBottom: "1rem", borderRadius: 6, border: "1px solid #cbd5e1", boxSizing: "border-box" };