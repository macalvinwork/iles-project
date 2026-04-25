import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Unauthorized from "./pages/Unauthorized";

import StudentDashboard from "./pages/student/Dashboard";
import Logs from "./pages/student/Logs";
import CreateLog from "./pages/student/CreateLog";
import LogDetail from "./pages/student/LogDetail";
import StudentPlacement from "./pages/student/Placement";

import SupervisorDashboard from "./pages/supervisor/Dashboard";
import ReviewLogs from "./pages/supervisor/ReviewLogs";

import AcademicDashboard from "./pages/academic/Dashboard";
import Evaluations from "./pages/academic/Evaluations";
import EvaluateStudent from "./pages/academic/EvaluateStudent";

import AdminDashboard from "./pages/admin/Dashboard";
import Users from "./pages/admin/Users";
import Register from "./pages/admin/Register";
import Placements from "./pages/admin/Placements";

const R = (role, el) => <ProtectedRoute role={role}>{el}</ProtectedRoute>;

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Student */}
          <Route path="/student/dashboard" element={R("STUDENT", <StudentDashboard />)} />
          <Route path="/student/logs" element={R("STUDENT", <Logs />)} />
          <Route path="/student/logs/create" element={R("STUDENT", <CreateLog />)} />
          <Route path="/student/logs/:id" element={R("STUDENT", <LogDetail />)} />
          <Route path="/student/placement" element={R("STUDENT", <StudentPlacement />)} />

          {/* Workplace Supervisor */}
          <Route path="/supervisor/dashboard" element={R("WORKPLACE_SUPERVISOR", <SupervisorDashboard />)} />
          <Route path="/supervisor/logs" element={R("WORKPLACE_SUPERVISOR", <ReviewLogs />)} />

          {/* Academic Supervisor */}
          <Route path="/academic/dashboard" element={R("ACADEMIC_SUPERVISOR", <AcademicDashboard />)} />
          <Route path="/academic/evaluations" element={R("ACADEMIC_SUPERVISOR", <Evaluations />)} />
          <Route path="/academic/evaluate" element={R("ACADEMIC_SUPERVISOR", <EvaluateStudent />)} />

          {/* Admin */}
          <Route path="/admin/dashboard" element={R("ADMIN", <AdminDashboard />)} />
          <Route path="/admin/users" element={R("ADMIN", <Users />)} />
          <Route path="/admin/register" element={R("ADMIN", <Register />)} />
          <Route path="/admin/placements" element={R("ADMIN", <Placements />)} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}