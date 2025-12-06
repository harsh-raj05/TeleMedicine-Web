import { Navigate } from "react-router-dom";

function RoleProtectedRoute({ children, allowedRole }) {
  const token = localStorage.getItem("token");
  const userData = localStorage.getItem("user");

  // If no token OR no user → redirect to login
  if (!token || !userData) {
    return <Navigate to="/" replace />;
  }

  let user;

  try {
    user = JSON.parse(userData);
  } catch (e) {
    // If JSON parse fails → force logout
    localStorage.clear();
    return <Navigate to="/" replace />;
  }

  // ROLE CHECK (critical)
  if (user.role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default RoleProtectedRoute;
