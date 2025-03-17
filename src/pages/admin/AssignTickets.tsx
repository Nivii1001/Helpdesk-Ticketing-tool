import { useEffect, useState } from "react";

const API_URL = "http://localhost:3000/api"; // Update as needed

const AssignTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [agents, setAgents] = useState([]);
  const [selectedAgents, setSelectedAgents] = useState({}); // Store selected agents for each ticket

  useEffect(() => {
    fetchTickets();
    fetchAgents();
  }, []);

  // Fetch Open Tickets
  const fetchTickets = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("No token found, please log in again.");

      const response = await fetch(`${API_URL}/tickets/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (!Array.isArray(data)) throw new Error("API did not return an array");
      setTickets(data.filter(ticket => ticket.status === "Open")); // Show only open tickets
    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  };

  // Fetch Support Agents
  const fetchAgents = async () => {
    try {
      const response = await fetch(`${API_URL}/tickets/agents`);
      const data = await response.json();

      if (!Array.isArray(data)) throw new Error("API did not return an array");
      setAgents(data);
    } catch (error) {
      console.error("Error fetching agents:", error);
    }
  };

  // Handle Assign Ticket
  const handleAssign = async (ticketId) => {
    const assignedTo = selectedAgents[ticketId]; // Get selected agent for this ticket
    if (!assignedTo) return alert("Please select an agent");

    const token = localStorage.getItem("token");
    if (!token) return alert("No token found, please log in again.");

    try {
      const response = await fetch(`${API_URL}/tickets/assign/${ticketId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ assignedTo }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Error assigning ticket");

      alert("Ticket assigned successfully!");
      fetchTickets(); // Refresh tickets list
    } catch (error) {
      console.error("Error assigning ticket:", error);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Assign Tickets</h2>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Ticket ID</th>
            <th className="border p-2">Title</th>
            <th className="border p-2">User</th>
            <th className="border p-2">Assign To</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {tickets.length > 0 ? (
            tickets.map(ticket => (
              <tr key={ticket._id} className="border">
                <td className="p-2 border">{ticket.ticketId}</td>
                <td className="p-2 border">{ticket.title}</td>
                <td className="p-2 border">{ticket.user?.username || "N/A"}</td>
                <td className="p-2 border">
                  <select
                    className="border p-2 rounded"
                    value={selectedAgents[ticket._id] || ""}
                    onChange={(e) =>
                      setSelectedAgents({ ...selectedAgents, [ticket._id]: e.target.value })
                    }
                  >
                    <option value="">Select Agent</option>
                    {agents.map(agent => (
                      <option key={agent._id} value={agent._id}>
                        {agent.username}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={() => handleAssign(ticket._id)}
                  >
                    Assign Ticket
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center p-4">No open tickets</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AssignTickets;
