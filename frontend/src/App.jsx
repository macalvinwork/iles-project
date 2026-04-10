import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import WeeklyLog from "./pages/WeeklyLog";

export default function App() {
  return (
    <div>
      <h1>ILES System</h1>

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/weekly-log" element={<WeeklyLog />} />
      </Routes>
    </div>
  );
}