import { useState } from "react";
import Layout from "../../components/Layout";
import { registerUser } from "../../services/userService";

export default function Register() {
  const [form, setForm] = useState({ email: "", first_name: "", last_name: "", role: "STUDENT", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    setLoading(true);
    try {
      await registerUser(form);
      setSuccess(`User ${form.email} created successfully.`);
      setForm({ email: "", first_name: "", last_name: "", role: "STUDENT", password: "" });
    } catch (err) {
      const errors = err.response?.data;
      setError(typeof errors === "object" ? JSON.stringify(errors) : "Failed to register user.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Register New User">
      <div style={{ maxWidth: 500, background: "#fff", padding: "2rem", borderRadius: 10 }}>
        {success && <p style={{ color: "#16a34a", fontWeight: 600 }}>{success}</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <label style={lbl}>First Name</label>
          <input name="first_name" value={form.first_name} onChange={handleChange} required style={inp} />
          <label style={lbl}>Last Name</label>
          <input name="last_name" value={form.last_name} onChange={handleChange} required style={inp} />
          <label style={lbl}>Email</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} required style={inp} />
          <label style={lbl}>Password</label>
          <input name="password" type="password" value={form.password} onChange={handleChange} required minLength={6} style={inp} />
          <label style={lbl}>Role</label>
          <select name="role" value={form.role} onChange={handleChange} style={inp}>
            <option value="STUDENT">Student</option>
            <option value="WORKPLACE_SUPERVISOR">Workplace Supervisor</option>
            <option value="ACADEMIC_SUPERVISOR">Academic Supervisor</option>
            <option value="ADMIN">Admin</option>
          </select>
          <button type="submit" disabled={loading} style={{ padding: "0.75rem 1.5rem", background: "#2563eb", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 600 }}>
            {loading ? "Creating..." : "Create User"}
          </button>
        </form>
      </div>
    </Layout>
  );
}

const lbl = { display: "block", fontWeight: 600, marginBottom: 4, fontSize: "0.875rem" };
const inp = { display: "block", width: "100%", padding: "0.6rem", marginBottom: "1rem", borderRadius: 6, border: "1px solid #cbd5e1", boxSizing: "border-box" };