import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import { fetchCriteria, submitEvaluation } from "../../services/evaluationService";
import { fetchPlacements } from "../../services/placementService";

export default function EvaluateStudent() {
  const navigate = useNavigate();
  const [criteria, setCriteria] = useState([]);
  const [placements, setPlacements] = useState([]);
  const [selectedPlacement, setSelectedPlacement] = useState("");
  const [scores, setScores] = useState({});
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    Promise.all([fetchCriteria(), fetchPlacements()])
      .then(([crit, plac]) => {
        setCriteria(crit.filter(c => c.is_active));
        setPlacements(plac);
      })
      .catch(console.error);
  }, []);

  const total = criteria.reduce((sum, c) => {
    return sum + ((Number(scores[c.id]) || 0) * (c.weight / 100));
  }, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const selectedP = placements.find(p => p.id === parseInt(selectedPlacement));
    try {
      await submitEvaluation({
        student: selectedP?.student,
        placement: selectedPlacement,
        scores,
        notes,
      });
      setSuccess(true);
      setTimeout(() => navigate("/academic/evaluations"), 2000);
    } catch (err) {
      const errors = err.response?.data;
      setError(typeof errors === "object" ? JSON.stringify(errors) : "Failed to submit.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout title="Submit Evaluation">
      <div style={{ maxWidth: 640, background: "#fff", padding: "2rem", borderRadius: 10 }}>
        {success && <p style={{ color: "#16a34a", fontWeight: 600 }}>Evaluation submitted! Redirecting...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        <form onSubmit={handleSubmit}>

          <label style={labelStyle}>Placement (Student)</label>
          <select
            value={selectedPlacement}
            onChange={e => setSelectedPlacement(e.target.value)}
            required
            style={inputStyle}
          >
            <option value="">-- Select placement --</option>
            {placements.map(p => (
              <option key={p.id} value={p.id}>
                {p.company_name} — Student ID: {p.student}
              </option>
            ))}
          </select>

          {criteria.length === 0 && (
            <p style={{ color: "#d97706" }}>
              No evaluation criteria found. Ask admin to add criteria first.
            </p>
          )}

          {criteria.map(c => (
            <div key={c.id} style={{ marginBottom: "1.25rem" }}>
              <label style={labelStyle}>
                {c.name}{" "}
                <span style={{ color: "#64748b", fontWeight: 400 }}>({c.weight}% weight)</span>
              </label>
              {c.description && (
                <p style={{ color: "#64748b", fontSize: "0.8rem", margin: "0 0 0.5rem" }}>
                  {c.description}
                </p>
              )}
              <input
                type="number"
                min={0}
                max={100}
                value={scores[c.id] || ""}
                onChange={e => setScores({ ...scores, [c.id]: e.target.value })}
                required
                style={inputStyle}
              />
            </div>
          ))}

          <div style={{ background: "#f1f5f9", padding: "1rem", borderRadius: 8, marginBottom: "1.25rem", textAlign: "center" }}>
            <strong>Computed Total Score:</strong>
            <span style={{ fontSize: "1.5rem", fontWeight: 700, marginLeft: 10, color: total >= 70 ? "#16a34a" : "#dc2626" }}>
              {total.toFixed(2)} / 100
            </span>
          </div>

          <label style={labelStyle}>Notes</label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={4}
            style={{ ...inputStyle, resize: "vertical" }}
          />

          <button
            type="submit"
            disabled={submitting}
            style={{ padding: "0.75rem 1.5rem", background: "#2563eb", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 600 }}
          >
            {submitting ? "Submitting..." : "Submit Evaluation"}
          </button>
        </form>
      </div>
    </Layout>
  );
}

const labelStyle = { display: "block", fontWeight: 600, marginBottom: 4, fontSize: "0.875rem" };
const inputStyle = { display: "block", width: "100%", padding: "0.6rem", marginBottom: "1rem", borderRadius: 6, border: "1px solid #cbd5e1", boxSizing: "border-box" };