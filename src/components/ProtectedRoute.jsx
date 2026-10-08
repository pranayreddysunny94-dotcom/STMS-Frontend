import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function ProtectedRoute({ children, allowedRoles }) {

  const { user } = useContext(AuthContext);

  const token = sessionStorage.getItem("token");
  const storedUser = sessionStorage.getItem("user");

  let currentUser = user;

  if (!currentUser && storedUser) {
    try {
      currentUser = JSON.parse(storedUser);
    } catch (error) {
      console.error("Invalid user data:", error);

      sessionStorage.removeItem("user");
      currentUser = null;
    }
  }

  // ==========================================
  // NOT LOGGED IN
  // ==========================================

  if (!token || !currentUser) {
    return <Navigate to="/login" replace />;
  }

  // ==========================================
  // GET USER ROLE
  // ==========================================

  let userRole =
    currentUser.role ||
    currentUser.roles?.[0] ||
    currentUser.authorities?.[0] ||
    "";

  userRole = String(userRole)
    .replace("ROLE_", "")
    .toUpperCase();

  // ==========================================
  // ROLE CHECK
  // ==========================================

  if (
    allowedRoles &&
    !allowedRoles
      .map((role) =>
        String(role)
          .replace("ROLE_", "")
          .toUpperCase()
      )
      .includes(userRole)
  ) {

    if (userRole === "STUDENT") {
      return <Navigate to="/student-dashboard" replace />;
    }

    if (userRole === "TRAINER") {
      return <Navigate to="/trainer-dashboard" replace />;
    }

    if (userRole === "ADMIN") {
      return <Navigate to="/admin-dashboard" replace />;
    }

    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;