import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { fetchPlacements, createPlacement } from "../../services/placementService";
import { fetchUsers } from "../../services/userService";

export default function Placements() {
  const [placements, setPlacements] = useState([]);
  const [students, setStudents] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ student: "", workplace_supervisor: "", company_name: "", start_date: "", end_date: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([fetchPlacements(), fetchUsers()])
      .then(([plac, users]) => {
        setPlacements(plac);
        setStudents(users.filter(u => u.role === "STUDENT"));
        setSupervisors(users.filter(u => u.role === "WORKPLACE_SUPERVISOR"));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSubmitting(true);
    try {
      const newP = await createPlacement(form);
      setPlacements([...placements, newP]);
      setShowForm(false);
      setForm({ student: "", workplace_supervisor: "", company_name: "", start_date: "", end_date: "" });
    } catch (err) {
      const errors = err.response?.data;
      setError(typeof errors === "object" ? JSON.stringify(errors) : "Failed to create placement.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout title="Manage Placements">
      <button onClick={() => setShowForm(!showForm)} style={{ padding: "0.6rem 1.2rem", background: "#2563eb", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", marginBottom: "1rem" }}>
        {showForm ? "Cancel" : "+ New Placement"}
      </button>

      {showForm && (
        <div style={{ background: "#fff", padding: "1.5rem", borderRadius: 10, marginBottom: 15 }}>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <form onSubmit={handleSubmit}>
            <label style={lbl}>Student</label>
            <select name="student" value={form.student} onChange={handleChange} required style={inp}>
              <option value="">-- Select student --</option>
              {students.map(s => <option key={s.id} value={s.id}>{s.first_name} {s.last_name}</option>)}
            </select>
            <label style={lbl}>Workplace Supervisor</label>
            <select name="workplace_supervisor" value={form.workplace_supervisor} onChange={handleChange} required style={inp}>
              <option value="">-- Select supervisor --</option>
              {supervisors.map(s => <option key={s.id} value={s.id}>{s.first_name} {s.last_name}</option>)}
            </select>
            <label style={lbl}>Company Name</label>
            <input name="company_name" value={form.company_name} onChange={handleChange} required style={inp} />
            <label style={lbl}>Start Date</label>
            <input name="start_date" type="date" value={form.start_date} onChange={handleChange} required style={inp} />
            <label style={lbl}>End Date</label>
            <input name="end_date" type="date" value={form.end_date} onChange={handleChange} required style={inp} />
            <button type="submit" disabled={submitting} style={{ padding: "0.6rem 1.2rem", background: "#16a34a", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}>
              {submitting ? "Creating..." : "Create Placement"}
            </button>
          </form>
        </div>
      )}

      {loading && <p>Loading...</p>}
      {placements.map(p => (
        <div key={p.id} style={{ background: "#fff", padding: "1.25rem", borderRadius: 10, marginBottom: 10, display: "flex", justifyContent: "space-between" }}>
          <div>
            <strong>{p.company_name}</strong>
            <p style={{ margin: "0.25rem 0 0", color: "#64748b", fontSize: "0.85rem" }}>
              {p.start_date} → {p.end_date}
            </p>
          </div>
        </div>
      ))}
    </Layout>
  );
}

const lbl = { display: "block", fontWeight: 600, marginBottom: 4, fontSize: "0.875rem" };
const inp = { display: "block", width: "100%", padding: "0.6rem", marginBottom: "1rem", borderRadius: 6, border: "1px solid #cbd5e1", boxSizing: "border-box" };