import { Routes, Route } from "react-router-dom";
import AdminDashboard from "../pages/admin/admin-dashboard";
import AddUser from "../pages/admin/AddUser";
import ManageUsers from "@/pages/admin/Manageusers";
import TicketHistory from "../pages/admin/TicketHistory";
// import AssignTicket from "../pages/admin/AssignTickets";
import AdminTickets from "../pages/admin/AssignTickets";
import AssignTickets from "../pages/admin/AssignTickets";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminDashboard />} />
      <Route path="AddUser" element={<AddUser />} />
      <Route path="ManageUsers" element={<ManageUsers />} />
      <Route path="TicketHistory" element={<TicketHistory />} />
      <Route path="AssignTickets" element={<AssignTickets />} />
    </Routes>
  );
};

export default AdminRoutes;
