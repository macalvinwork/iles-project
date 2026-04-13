import Layout from "../../components/Layout";

export default function SupervisorDashboard() {
  return (
    <Layout title="Supervisor Dashboard">

      <div style={{ display: "grid", gap: "15px" }}>

        <div style={card}>
          <h3>👨‍🎓 Assigned Interns</h3>
          <button>View Interns</button>
        </div>

        <div style={card}>
          <h3>📄 Pending Logs</h3>
          <button>Review Logs</button>
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