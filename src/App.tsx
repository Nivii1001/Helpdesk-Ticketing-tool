import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/register";
import Login from "./pages/login";
import ForgotPassword from "./pages/forgetpassword";
import ResetPassword from "./pages/ResetPassword";
import { ThemeProvider } from "./components/theme-provider";
import Dashboard from "./pages/dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import SupportDashboard from "./pages/support-dashboard";
import CreateTicket from "./pages/CreateTicket";
import AdminRoutes from "./routes/AdminRoutes";
// import NotFoundPage from "./pages/NotFoundPage"; // Ensure this page exists

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router>
        <Routes>
          {/* Default Route */}
          <Route path="/" element={<Navigate to="/login" />} />

          {/* Public Routes */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgetpassword" element={<ForgotPassword />} />
          <Route path="/ResetPassword/:token" element={<ResetPassword />} />

          {/* Role-Based Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
            <Route path="/admin-dashboard/*" element={<AdminRoutes />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["User"]} />}>
            <Route path="/CreateTicket" element={<CreateTicket />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["Support Agent"]} />}>
            <Route path="/support-dashboard" element={<SupportDashboard />} />
          </Route>

          {/* Common Dashboard for All Roles */}
          <Route element={<ProtectedRoute allowedRoles={["Admin", "User", "Support Agent"]} />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>

          {/* <Route path="*" element={<NotFoundPage />} /> */}
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
