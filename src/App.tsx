import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/register";
import Login from "./pages/login";
import ForgotPassword from "./pages/forgetpassword";
import ResetPassword from "./pages/ResetPassword";
import { ThemeProvider } from "./components/theme-provider";
import Dashboard from "./pages/dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import SupportDashboard from "./pages/SupportDashboard";
import AdminRoutes from "./routes/AdminRoutes";
import UserRoutes from "./routes/UserRoutes";
// import NotFoundPage from "./pages/NotFoundPage"; 

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />

          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgetpassword" element={<ForgotPassword />} />
          <Route path="/ResetPassword/:token" element={<ResetPassword />} />

          <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
            <Route path="/admin-dashboard/*" element={<AdminRoutes />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={["User"]} />}>
            <Route path="/UserDashboard/*" element={<UserRoutes />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={["Support Agent"]} />}>
            <Route path="/SupportDashboard" element={<SupportDashboard />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["Admin", "User", "Support Agent"]} />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>

        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
