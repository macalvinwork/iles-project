import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    const user = login(email, password);

    if (!user) return alert("Invalid credentials");

    // redirect based on role
    if (user.role === "student") navigate("/student");
    if (user.role === "supervisor") navigate("/supervisor");
    if (user.role === "academic") navigate("/academic");
    if (user.role === "admin") navigate("/admin");
  };

  return (
    <div style={{ padding: 50 }}>
      <h2>ILES Login</h2>

      <form onSubmit={handleLogin}>
        <input
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <br /><br />

        <input
          placeholder="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <br /><br />

        <button type="submit">Login</button>
      </form>

      <p>
        Try emails:
        student@test.com
        supervisor@test.com
        admin@test.com
      </p>
    </div>
  );
}