import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Unauthorized from "./pages/Unauthorized";

import StudentDashboard from "./pages/student/Dashboard";
import Logs from "./pages/student/Logs";
import CreateLog from "./pages/student/CreateLog";
import LogDetail from "./pages/student/LogDetail";

import SupervisorDashboard from "./pages/supervisor/Dashboard";
import ReviewLogs from "./pages/supervisor/ReviewLogs";

import AcademicDashboard from "./pages/academic/Dashboard";
import Students from "./pages/academic/Students";
import EvaluateStudent from "./pages/academic/EvaluateStudent";

import AdminDashboard from "./pages/admin/Dashboard";
import Users from "./pages/admin/Users";

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
          <Route path="/student/dashboard" element={R("student", <StudentDashboard />)} />
          <Route path="/student/logs" element={R("student", <Logs />)} />
          <Route path="/student/logs/create" element={R("student", <CreateLog />)} />
          <Route path="/student/logs/:id" element={R("student", <LogDetail />)} />

          {/* Supervisor */}
          <Route path="/supervisor/dashboard" element={R("supervisor", <SupervisorDashboard />)} />
          <Route path="/supervisor/review" element={R("supervisor", <ReviewLogs />)} />

          {/* Academic */}
          <Route path="/academic/dashboard" element={R("academic", <AcademicDashboard />)} />
          <Route path="/academic/students" element={R("academic", <Students />)} />
          <Route path="/academic/evaluate/:id" element={R("academic", <EvaluateStudent />)} />

          {/* Admin */}
          <Route path="/admin/dashboard" element={R("admin", <AdminDashboard />)} />
          <Route path="/admin/users" element={R("admin", <Users />)} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}