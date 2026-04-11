import { Routes, Route } from "react-router-dom";

import Login from "./pages/auth/Login";

import StudentDashboard from "./pages/student/Dashboard";
import SupervisorDashboard from "./pages/supervisor/Dashboard";
import AcademicDashboard from "./pages/academic/Dashboard";
import AdminDashboard from "./pages/admin/Dashboard";

import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* PUBLIC */}
      <Route path="/" element={<Login />} />

      {/* STUDENT */}
      <Route
        path="/student"
        element={
          <ProtectedRoute>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />

      {/* SUPERVISOR */}
      <Route
        path="/supervisor"
        element={
          <ProtectedRoute>
            <SupervisorDashboard />
          </ProtectedRoute>
        }
      />

      {/* ACADEMIC */}
      <Route
        path="/academic"
        element={
          <ProtectedRoute>
            <AcademicDashboard />
          </ProtectedRoute>
        }
      />

      {/* ADMIN */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;