import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));

  // if not logged in → go back to login
  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
}