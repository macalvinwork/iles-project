import Layout from "../../components/Layout";

export default function StudentDashboard() {
  return (
    <Layout title="Student Dashboard">

      <div style={{ display: "grid", gap: "15px" }}>

        {/* CARDS */}
        <div style={card}>
          <h3>📍 Placement</h3>
          <p>Company: Tech Ltd</p>
          <p>Supervisor: Mr John</p>
        </div>

        <div style={card}>
          <h3>📝 Weekly Logs</h3>
          <button>Create Log</button>
          <button>View Logs</button>
        </div>

        <div style={card}>
          <h3>📊 Status</h3>
          <p>2 Submitted | 1 Draft</p>
        </div>

      </div>

    </Layout>
  );
}

const card = {
  padding: "15px",
  background: "white",
  borderRadius: "10px",
  boxShadow: "0 0 5px rgba(0,0,0,0.1)"
};
