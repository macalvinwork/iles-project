import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import { fetchDashboard } from "../../services/userService";

export default function AcademicDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboard()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout title="Academic Supervisor Dashboard">
      <div style={{ background: "#fff", padding: "1.25rem", borderRadius: 10, borderLeft: "4px solid #2563eb", maxWidth: 300 }}>
        <p style={{ margin: 0, color: "#64748b" }}>Total Evaluations</p>
        <h2 style={{ margin: "0.25rem 0 0", color: "#2563eb" }}>
          {loading ? "..." : data?.total_evaluations}
        </h2>
      </div>
      <div style={{ marginTop: "1.5rem", background: "#fff", padding: "1.5rem", borderRadius: 10 }}>
        <h3 style={{ marginTop: 0 }}>Quick Actions</h3>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => navigate("/academic/evaluations")} style={btn("#2563eb")}>
            View Evaluations
          </button>
          <button onClick={() => navigate("/academic/evaluate")} style={btn("#16a34a")}>
            + New Evaluation
          </button>
        </div>
      </div>
    </Layout>
  );
}

const btn = bg => ({
  padding: "0.6rem 1.2rem", background: bg, color: "#fff",
  border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 600
});