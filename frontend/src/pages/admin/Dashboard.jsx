import Layout from "../../components/Layout";

export default function AdminDashboard() {
  return (
    <Layout title="Admin Dashboard">

      <div style={{ display: "grid", gap: "15px" }}>

        <div style={card}>
          <h3>👥 Users</h3>
          <button>Manage Users</button>
        </div>

        <div style={card}>
          <h3>📍 Placements</h3>
          <button>Assign Placement</button>
        </div>

        <div style={card}>
          <h3>📊 Reports</h3>
          <button>View Reports</button>
        </div>

      </div>

    </Layout>
  );
}

const card = {
  padding: "15px",
  background: "white",
  borderRadius: "10px",
};