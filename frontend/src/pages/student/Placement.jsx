import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { fetchPlacements } from "../../services/placementService";

export default function StudentPlacement() {
  const [placement, setPlacement] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlacements()
      .then(data => setPlacement(data[0] || null))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout title="My Placement">
      {loading && <p>Loading...</p>}
      {!loading && !placement && <p>No placement assigned yet. Contact your admin.</p>}
      {placement && (
        <div style={{ background: "#fff", padding: "1.5rem", borderRadius: 10, maxWidth: 500 }}>
          <h3 style={{ marginTop: 0 }}>{placement.company_name}</h3>
          <p><strong>Start Date:</strong> {placement.start_date}</p>
          <p><strong>End Date:</strong> {placement.end_date}</p>
        </div>
      )}
    </Layout>
  );
}