import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { fetchUsers, registerUser, deleteUser } from "../../services/userService";
import { createPlacement } from "../../services/placementService";

const roleColor = {
  STUDENT: "#2563eb",
  WORKPLACE_SUPERVISOR: "#7c3aed",
  ACADEMIC_SUPERVISOR: "#0891b2",
  ADMIN: "#dc2626"
};

const roleLabel = {
  STUDENT: "Student",
  WORKPLACE_SUPERVISOR: "Workplace Supervisor",
  ACADEMIC_SUPERVISOR: "Academic Supervisor",
  ADMIN: "Admin"
};

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    email: "", first_name: "", last_name: "",
    role: "STUDENT", password: ""
  });
  const [placement, setPlacement] = useState({
    company_name: "", start_date: "", end_date: "", workplace_supervisor: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchUsers()
      .then(setUsers)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const supervisors = users.filter(u => u.role === "WORKPLACE_SUPERVISOR");

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handlePlacementChange = e => setPlacement({ ...placement, [e.target.name]: e.target.value });

  const handleAdd = async (e) => {
    e.preventDefault();
    setError(""); setSuccess(""); setSubmitting(true);
    try {
      const newUser = await registerUser(form);
      setUsers(prev => [...prev, newUser]);

      if (form.role === "STUDENT" && placement.company_name) {
        await createPlacement({
          student: newUser.id,
          workplace_supervisor: placement.workplace_supervisor,
          company_name: placement.company_name,
          start_date: placement.start_date,
          end_date: placement.end_date,
        });
      }

      setSuccess(`User ${form.email} created successfully.`);
      setForm({ email: "", first_name: "", last_name: "", role: "STUDENT", password: "" });
      setPlacement({ company_name: "", start_date: "", end_date: "", workplace_supervisor: "" });
      setShowForm(false);
    } catch (err) {
      const errors = err.response?.data;
      setError(typeof errors === "object" ? JSON.stringify(errors) : "Failed to create user.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, email) => {
    if (!window.confirm(`Delete user ${email}?`)) return;
    try {
      await deleteUser(id);
      setUsers(users.filter(u => u.id !== id));
    } catch {
      alert("Failed to delete user.");
    }
  };

  const filtered = filter === "all" ? users : users.filter(u => u.role === filter);

  return (
    <Layout title="Manage Users">
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem", flexWrap: "wrap", gap: 10 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["all", "STUDENT", "WORKPLACE_SUPERVISOR", "ACADEMIC_SUPERVISOR", "ADMIN"].map(r => (
            <button key={r} onClick={() => setFilter(r)}
              style={{ padding: "0.4rem 0.9rem", borderRadius: 6, border: "1px solid #cbd5e1", background: filter === r ? "#2563eb" : "#fff", color: filter === r ? "#fff" : "#1e293b", cursor: "pointer", fontSize: "0.85rem" }}>
              {r === "all" ? "All" : roleLabel[r]}
            </button>
          ))}
        </div>
        <button onClick={() => setShowForm(!showForm)}
          style={{ padding: "0.4rem 1rem", background: "#16a34a", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 600 }}>
          {showForm ? "Cancel" : "+ Add User"}
        </button>
      </div>

      {success && <p style={{ color: "#16a34a", fontWeight: 600 }}>{success}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {showForm && (
        <div style={{ background: "#fff", padding: "1.5rem", borderRadius: 10, marginBottom: 15 }}>
          <form onSubmit={handleAdd}>
            <h3 style={{ marginTop: 0 }}>User Details</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 15 }}>
              <div>
                <label style={lbl}>First Name</label>
                <input name="first_name" value={form.first_name} onChange={handleChange} required style={inp} />
              </div>
              <div>
                <label style={lbl}>Last Name</label>
                <input name="last_name" value={form.last_name} onChange={handleChange} required style={inp} />
              </div>
              <div>
                <label style={lbl}>Email</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} required style={inp} />
              </div>
              <div>
                <label style={lbl}>Password</label>
                <input name="password" type="password" value={form.password} onChange={handleChange} required minLength={6} style={inp} />
              </div>
              <div>
                <label style={lbl}>Role</label>
                <select name="role" value={form.role} onChange={handleChange} style={inp}>
                  <option value="STUDENT">Student</option>
                  <option value="WORKPLACE_SUPERVISOR">Workplace Supervisor</option>
                  <option value="ACADEMIC_SUPERVISOR">Academic Supervisor</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
            </div>

            {form.role === "STUDENT" && (
              <>
                <h3>Placement Details (optional)</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 15 }}>
                  <div>
                    <label style={lbl}>Company Name</label>
                    <input name="company_name" value={placement.company_name} onChange={handlePlacementChange} style={inp} />
                  </div>
                  <div>
                    <label style={lbl}>Workplace Supervisor</label>
                    <select name="workplace_supervisor" value={placement.workplace_supervisor} onChange={handlePlacementChange} style={inp}>
                      <option value="">-- Select supervisor --</option>
                      {supervisors.map(s => (
                        <option key={s.id} value={s.id}>{s.first_name} {s.last_name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={lbl}>Start Date</label>
                    <input name="start_date" type="date" value={placement.start_date} onChange={handlePlacementChange} style={inp} />
                  </div>
                  <div>
                    <label style={lbl}>End Date</label>
                    <input name="end_date" type="date" value={placement.end_date} onChange={handlePlacementChange} style={inp} />
                  </div>
                </div>
              </>
            )}

            <button type="submit" disabled={submitting}
              style={{ marginTop: 15, padding: "0.6rem 1.5rem", background: "#2563eb", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 600 }}>
              {submitting ? "Creating..." : "Create User"}
            </button>
          </form>
        </div>
      )}

      {loading && <p>Loading...</p>}
      <div style={{ background: "#fff", borderRadius: 10, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
              {["Name", "Email", "Role", "Status", "Action"].map(h => (
                <th key={h} style={{ padding: "0.75rem 1rem", textAlign: "left", fontSize: "0.85rem", color: "#64748b" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ padding: "0.75rem 1rem" }}>{u.first_name} {u.last_name}</td>
                <td style={{ padding: "0.75rem 1rem", color: "#64748b" }}>{u.email}</td>
                <td style={{ padding: "0.75rem 1rem" }}>
                  <span style={{ background: (roleColor[u.role] || "#64748b") + "20", color: roleColor[u.role] || "#64748b", padding: "0.2rem 0.6rem", borderRadius: 20, fontSize: "0.8rem", fontWeight: 600 }}>
                    {roleLabel[u.role] || u.role}
                  </span>
                </td>
                <td style={{ padding: "0.75rem 1rem", color: u.is_active ? "#16a34a" : "#dc2626" }}>
                  {u.is_active ? "Active" : "Inactive"}
                </td>
                <td style={{ padding: "0.75rem 1rem" }}>
                  <button onClick={() => handleDelete(u.id, u.email)}
                    style={{ padding: "0.3rem 0.7rem", background: "#dc2626", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: "0.8rem" }}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}

const lbl = { display: "block", fontWeight: 600, marginBottom: 4, fontSize: "0.875rem" };
const inp = { display: "block", width: "100%", padding: "0.6rem", borderRadius: 6, border: "1px solid #cbd5e1", boxSizing: "border-box" };