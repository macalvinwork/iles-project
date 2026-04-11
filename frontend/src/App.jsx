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
      <Route path="/" element={<Login />} />

      <Route
        path="/student"
        element={
          <ProtectedRoute>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/supervisor"
        element={
          <ProtectedRoute>
            <SupervisorDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/academic"
        element={
          <ProtectedRoute>
            <AcademicDashboard />
          </ProtectedRoute>
        }
      />

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