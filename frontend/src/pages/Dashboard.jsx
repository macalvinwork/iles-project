import { useEffect, useState } from "react";
import api from "../services/api";
import { logoutUser } from "../services/auth";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [logs, setLogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/logs/")
      .then((res) => setLogs(res.data))
      .catch((err) => console.log(err));
  }, []);

  const logout = () => {
    logoutUser();
    navigate("/");
  };

  return (
    <div style={styles.layout}>
      {/* SIDEBAR */}
      <div style={styles.sidebar}>
        <h3>ILES</h3>
        <p>Dashboard</p>
        <p>Logs</p>
        <p>Placements</p>
        <p>Evaluations</p>

        <button onClick={logout}>Logout</button>
      </div>

      {/* MAIN CONTENT */}
      <div style={styles.main}>
        <h2>Dashboard</h2>

        <div style={styles.cards}>
          <div style={styles.card}>Total Logs: {logs.length}</div>
          <div style={styles.card}>Placements</div>
          <div style={styles.card}>Evaluations</div>
        </div>

        <h3>Recent Logs</h3>
        <div>
          {logs.map((log, i) => (
            <div key={i} style={styles.logItem}>
              {log.title || "No Title"}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  layout: {
    display: "flex",
  },
  sidebar: {
    width: "200px",
    height: "100vh",
    background: "#1f2937",
    color: "white",
    padding: "20px",
  },
  main: {
    flex: 1,
    padding: "20px",
  },
  cards: {
    display: "flex",
    gap: "10px",
  },
  card: {
    background: "white",
    padding: "15px",
    borderRadius: "8px",
    flex: 1,
    boxShadow: "0 0 5px rgba(0,0,0,0.1)",
  },
  logItem: {
    background: "white",
    padding: "10px",
    marginTop: "5px",
    borderRadius: "5px",
  },
};