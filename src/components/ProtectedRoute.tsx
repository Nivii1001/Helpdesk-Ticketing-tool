import { Navigate, Outlet } from "react-router-dom";

// Get user from localStorage safely
const getUserFromStorage = () => {
  try {
    const user = localStorage.getItem("user");
    return user && user !== "undefined" ? JSON.parse(user) : null;
  } catch (error) {
    console.error("[ProtectedRoute] Error parsing user data:", error);
    return null;
  }
};

const ProtectedRoute = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const user = getUserFromStorage();

  if (!user) {
    console.warn("[ProtectedRoute] No user found, redirecting to login...");
    return <Navigate to="/login" replace />;
  }

  console.info(`[ProtectedRoute] User Role: ${user.role}`);

  if (!allowedRoles.includes(user.role)) {
    console.warn(`[ProtectedRoute] Unauthorized access for role: ${user.role}. Redirecting...`);
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
