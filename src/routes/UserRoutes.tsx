import { Routes, Route } from "react-router-dom";
import CreateTicket from "@/pages/user/CreateTicket";
import UserDashboard from "@/pages/user/UserDashboard";
import TicketStatus from "@/pages/user/TicketStatus";

const UserRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<UserDashboard />} />
      <Route path="CreateTicket" element={<CreateTicket />} />
      <Route path="TicketStatus" element={<TicketStatus />} />
      
    </Routes>
  );
};

export default UserRoutes;
