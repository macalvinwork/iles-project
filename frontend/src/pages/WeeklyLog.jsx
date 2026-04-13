import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
      <Link to="/">Login</Link> |{" "}
      <Link to="/dashboard">Dashboard</Link> |{" "}
      <Link to="/weekly-log">Weekly Log</Link>
    </div>
  );
}