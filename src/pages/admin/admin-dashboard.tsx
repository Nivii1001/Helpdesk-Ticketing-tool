import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

import { FaUserPlus, FaUsers, FaHistory, FaClipboardList } from "react-icons/fa";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const adminActions = [
    { title: "Create User", icon: <FaUserPlus size={40} />, path: "/admin-dashboard/AddUser" },
    { title: "Manage Users", icon: <FaUsers size={40} />, path: "/admin-dashboard/ManageUsers" },
    { title: "Assign Tickets", icon: <FaClipboardList size={40} />, path: "/admin-dashboard/AssignTickets" },
    { title: "Ticket History", icon: <FaHistory size={40} />, path: "/admin-dashboard/TicketHistory" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 p-10 flex flex-col items-center">
      <h1 className="text-4xl font-bold text-white mb-10">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {adminActions.map((action, index) => (
          <Card 
            key={index} 
            className="w-64 h-48 cursor-pointer transition transform hover:scale-105 bg-white shadow-xl rounded-lg flex flex-col items-center justify-center"
            onClick={() => navigate(action.path)}
          >
            <CardHeader className="flex flex-col items-center">
              <div className="text-blue-600">{action.icon}</div>
              <CardTitle className="text-gray-800 text-xl mt-2">{action.title}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
