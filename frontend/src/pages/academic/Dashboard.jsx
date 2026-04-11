import Layout from "../../components/Layout";

export default function AcademicDashboard() {
  return (
    <Layout title="Academic Supervisor">

      <div style={{ display: "grid", gap: "15px" }}>

        <div style={card}>
          <h3>🎯 Students to Evaluate</h3>
          <button>View Students</button>
        </div>

        <div style={card}>
          <h3>📊 Scoring</h3>
          <button>Open Evaluation Form</button>
        </div>

      </div>

    </Layout>
  );
}

const card = {
  padding: "15px",
  background: "#fff",
  borderRadius: "10px",
};