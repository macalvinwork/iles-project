import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import { fetchEvaluations } from "../../services/evaluationService";

export default function Evaluations() {
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvaluations()
      .then(setEvaluations)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout title="Evaluations">
      <button
        onClick={() => navigate("/academic/evaluate")}
        style={{ padding: "0.6rem 1.2rem", background: "#2563eb", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", marginBottom: "1rem" }}>
        + New Evaluation
      </button>
      {loading && <p>Loading...</p>}
      {!loading && evaluations.length === 0 && <p>No evaluations submitted yet.</p>}
      {evaluations.map(e => (
        <div key={e.id} style={{ background: "#fff", padding: "1.25rem", borderRadius: 10, marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <strong>{e.student_name}</strong>
            <p style={{ margin: "0.25rem 0 0", color: "#64748b", fontSize: "0.85rem" }}>
              Submitted: {e.submitted_at?.slice(0, 10)}
            </p>
          </div>
          <span style={{ fontSize: "1.25rem", fontWeight: 700, color: e.total_score >= 70 ? "#16a34a" : "#dc2626" }}>
            {e.total_score} / 100
          </span>
        </div>
      ))}
    </Layout>
  );
}