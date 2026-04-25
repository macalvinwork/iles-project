import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import { createLog } from "../../services/logService";
import { fetchPlacements } from "../../services/placementService";

export default function CreateLog() {
 const [form, setForm] = useState({
    placement: "",
    week_number: "",
    week_start_date: "",
    activities: "",
    learning_outcomes: "",
    challenges: "",
    submission_deadline: "",
});

  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlacements().then(setPlacements).catch(console.error);
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await createLog(form);
      navigate("/student/logs");
    } catch (err) {
      const errors = err.response?.data;
      if (typeof errors === "object") {
        const messages = Object.entries(errors).map(([k, v]) => `${k}: ${v}`).join(" | ");
        setError(messages);
      } else {
        setError("Failed to create log.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Create Weekly Log">
      <div style={{ maxWidth: 640, background: "#fff", padding: "2rem", borderRadius: 10 }}>
        {error && <p style={{ color: "red", fontSize: "0.875rem" }}>{error}</p>}
        <form onSubmit={handleSubmit}>

          <label style={labelStyle}>Placement</label>
          <select name="placement" value={form.placement} onChange={handleChange} required style={inputStyle}>
            <option value="">-- Select your placement --</option>
            {placements.map(p => (
              <option key={p.id} value={p.id}>{p.company_name}</option>
            ))}
          </select>
          <label style={labelStyle}>Week Number</label>
          <input
            name="week_number"
            type="number"
            min={1}
            value={form.week_number}
            onChange={handleChange}
            required
            style={inputStyle}
            placeholder="e.g. 1"
          />
          <label style={labelStyle}>Week Start Date</label>
          <input
            name="week_start_date"
            type="date"
            value={form.week_start_date}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <label style={labelStyle}>Submission Deadline</label>
          <input
            name="submission_deadline"
            type="datetime-local"
            value={form.submission_deadline}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <label style={labelStyle}>Activities</label>
          <textarea
            name="activities"
            value={form.activities}
            onChange={handleChange}
            required
            rows={5}
            style={{ ...inputStyle, resize: "vertical" }}
            placeholder="What did you do this week?"
          />

          <label style={labelStyle}>Learning Outcomes</label>
          <textarea
            name="learning_outcomes"
            value={form.learning_outcomes}
            onChange={handleChange}
            required
            rows={3}
            style={{ ...inputStyle, resize: "vertical" }}
            placeholder="What did you learn?"
          />

          <label style={labelStyle}>Challenges (optional)</label>
          <textarea
            name="challenges"
            value={form.challenges}
            onChange={handleChange}
            rows={3}
            style={{ ...inputStyle, resize: "vertical" }}
            placeholder="Any challenges faced?"
          />

          <button type="submit" disabled={loading} style={btnStyle}>
            {loading ? "Saving..." : "Save as Draft"}
          </button>
        </form>
      </div>
    </Layout>
  );
}

const labelStyle = { display: "block", fontWeight: 600, marginBottom: 4, fontSize: "0.875rem", color: "#374151" };
const inputStyle = { display: "block", width: "100%", padding: "0.6rem", marginBottom: "1rem", borderRadius: 6, border: "1px solid #cbd5e1", boxSizing: "border-box" };
const btnStyle = { padding: "0.7rem 1.5rem", background: "#2563eb", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 600 };