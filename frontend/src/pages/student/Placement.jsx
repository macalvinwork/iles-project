import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { fetchPlacements } from "../../services/placementService";
import { fetchUserById } from "../../services/userService";

export default function StudentPlacement() {
  const [placement, setPlacement] = useState(null);
  const [supervisor, setSupervisor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlacements()
      .then(async (placements) => {
        const p = placements[0] || null;
        setPlacement(p);
        if (p?.workplace_supervisor) {
          const sup = await fetchUserById(p.workplace_supervisor);
          setSupervisor(sup);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout title="My Placement">
      {loading && <p>Loading...</p>}
      {!loading && !placement && (
        <p style={{ color: "#64748b" }}>No placement assigned yet. Contact your admin.</p>
      )}
      {placement && (
        <div style={{ display: "grid", gap: 15 }}>
          <div style={{ background: "#fff", padding: "1.5rem", borderRadius: 10, borderLeft: "4px solid #2563eb" }}>
            <h3 style={{ marginTop: 0, color: "#1e293b" }}>Placement Details</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <p style={{ margin: 0, color: "#64748b", fontSize: "0.85rem" }}>Company</p>
                <p style={{ margin: "0.25rem 0 0", fontWeight: 600 }}>{placement.company_name}</p>
              </div>
              <div>
                <p style={{ margin: 0, color: "#64748b", fontSize: "0.85rem" }}>Start Date</p>
                <p style={{ margin: "0.25rem 0 0", fontWeight: 600 }}>{placement.start_date}</p>
              </div>
              <div>
                <p style={{ margin: 0, color: "#64748b", fontSize: "0.85rem" }}>End Date</p>
                <p style={{ margin: "0.25rem 0 0", fontWeight: 600 }}>{placement.end_date}</p>
              </div>
            </div>
          </div>

          <div style={{ background: "#fff", padding: "1.5rem", borderRadius: 10, borderLeft: "4px solid #7c3aed" }}>
            <h3 style={{ marginTop: 0, color: "#1e293b" }}>Workplace Supervisor</h3>
            {supervisor ? (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <p style={{ margin: 0, color: "#64748b", fontSize: "0.85rem" }}>Full Name</p>
                  <p style={{ margin: "0.25rem 0 0", fontWeight: 600 }}>{supervisor.first_name} {supervisor.last_name}</p>
                </div>
                <div>
                  <p style={{ margin: 0, color: "#64748b", fontSize: "0.85rem" }}>Email</p>
                  <p style={{ margin: "0.25rem 0 0", fontWeight: 600 }}>{supervisor.email}</p>
                </div>
                <div>
                  <p style={{ margin: 0, color: "#64748b", fontSize: "0.85rem" }}>Role</p>
                  <p style={{ margin: "0.25rem 0 0", fontWeight: 600 }}>Workplace Supervisor</p>
                </div>
              </div>
            ) : (
              <p style={{ color: "#64748b" }}>Supervisor details not available.</p>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
}