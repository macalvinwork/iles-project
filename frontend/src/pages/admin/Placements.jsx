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
  const [form, setForm] = useState({
    student: "",
    workplace_supervisor: "",
    company_name: "",
    start_date: "",
    end_date: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
    setError(""); setSuccess(""); setSubmitting(true);
    try {
      const newP = await createPlacement(form);
      setPlacements([...placements, newP]);
      setSuccess("Placement created successfully.");
      setShowForm(false);
      setForm({ student: "", workplace_supervisor: "", company_name: "", start_date: "", end_date: "" });
    } catch (err) {
      const errors = err.response?.data;
      setError(typeof errors === "object" ? JSON.stringify(errors) : "Failed to create placement.");
    } finally {
      setSubmitting(false);
    }
  };

  const getStudentName = (id) => {
    const s = students.find(u => u.id === id);
    return s ? `${s.first_name} ${s.last_name}` : `Student ${id}`;
  };

  const getSupervisorName = (id) => {
    const s = supervisors.find(u => u.id === id);
    return s ? `${s.first_name} ${s.last_name}` : `Supervisor ${id}`;
  };

  return (
    <Layout title="Manage Placements">
      {success && <p style={{ color: "#16a34a", fontWeight: 600 }}>{success}</p>}

      <button
        onClick={() => setShowForm(!showForm)}
        style={{ padding: "0.6rem 1.2rem", background: "#2563eb", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", marginBottom: "1rem", fontWeight: 600 }}>
        {showForm ? "Cancel" : "+ New Placement"}
      </button>

      {showForm && (
        <div style={{ background: "#fff", padding: "1.5rem", borderRadius: 10, marginBottom: 15 }}>
          <h3 style={{ marginTop: 0 }}>Create Placement</h3>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 15 }}>
              <div>
                <label style={lbl}>Student</label>
                <select name="student" value={form.student} onChange={handleChange} required style={inp}>
                  <option value="">-- Select student --</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.first_name} {s.last_name} ({s.email})</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={lbl}>Workplace Supervisor</label>
                <select name="workplace_supervisor" value={form.workplace_supervisor} onChange={handleChange} required style={inp}>
                  <option value="">-- Select supervisor --</option>
                  {supervisors.map(s => (
                    <option key={s.id} value={s.id}>{s.first_name} {s.last_name} ({s.email})</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={lbl}>Company Name</label>
                <input name="company_name" value={form.company_name} onChange={handleChange} required style={inp} />
              </div>
              <div>
                <label style={lbl}>Start Date</label>
                <input name="start_date" type="date" value={form.start_date} onChange={handleChange} required style={inp} />
              </div>
              <div>
                <label style={lbl}>End Date</label>
                <input name="end_date" type="date" value={form.end_date} onChange={handleChange} required style={inp} />
              </div>
            </div>
            <button type="submit" disabled={submitting}
              style={{ marginTop: 15, padding: "0.6rem 1.5rem", background: "#16a34a", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 600 }}>
              {submitting ? "Creating..." : "Create Placement"}
            </button>
          </form>
        </div>
      )}

      {loading && <p>Loading...</p>}
      {!loading && placements.length === 0 && <p style={{ color: "#64748b" }}>No placements created yet.</p>}

      <div style={{ display: "grid", gap: 12 }}>
        {placements.map(p => (
          <div key={p.id} style={{ background: "#fff", padding: "1.25rem", borderRadius: 10, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <h3 style={{ margin: 0, color: "#1e293b" }}>{p.company_name}</h3>
                <p style={{ margin: "0.25rem 0 0", color: "#64748b", fontSize: "0.85rem" }}>
                  Student: <strong>{getStudentName(p.student)}</strong>
                </p>
                <p style={{ margin: "0.25rem 0 0", color: "#64748b", fontSize: "0.85rem" }}>
                  Supervisor: <strong>{getSupervisorName(p.workplace_supervisor)}</strong>
                </p>
                <p style={{ margin: "0.25rem 0 0", color: "#64748b", fontSize: "0.85rem" }}>
                  {p.start_date} → {p.end_date}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}

const lbl = { display: "block", fontWeight: 600, marginBottom: 4, fontSize: "0.875rem" };
const inp = { display: "block", width: "100%", padding: "0.6rem", borderRadius: 6, border: "1px solid #cbd5e1", boxSizing: "border-box" };