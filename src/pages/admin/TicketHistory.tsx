import { useEffect, useState } from "react";

interface Ticket {
  ticketId: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  attachments: { filename: string }[];
  user?: { username?: string; email?: string } | null; 
  assignedTo?: { name?: string } | null; 
}

function TicketHistory() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:3000/api/tickets/all", {
          method: "GET",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        if (!response.ok) throw new Error("Failed to fetch tickets");

        const data = await response.json();
        setTickets(data);
      } catch (error) {
        setError("Failed to load tickets");
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-6xl bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Ticket History
        </h2>

        {error && <p className="text-red-600 text-center">{error}</p>}

        {loading ? (
          <p className="text-gray-600 text-center">Loading tickets...</p>
        ) : tickets.length === 0 ? (
          <p className="text-gray-600 text-center">No tickets found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 rounded-lg">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="p-3 border border-gray-300">Ticket ID</th>
                  <th className="p-3 border border-gray-300">Title</th>
                  <th className="p-3 border border-gray-300">Description</th>
                  <th className="p-3 border border-gray-300">Created By</th>
                  <th className="p-3 border border-gray-300">Attachments</th>
                  <th className="p-3 border border-gray-300">Status</th>
                  <th className="p-3 border border-gray-300">Assigned Agent</th>
                  <th className="p-3 border border-gray-300">Created At</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket, index) => (
                  <tr
                    key={ticket.ticketId}
                    className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
                  >
                    <td className="p-3 border border-gray-300">{ticket.ticketId}</td>
                    <td className="p-3 border border-gray-300 font-semibold">{ticket.title}</td>
                    <td className="p-3 border border-gray-300">{ticket.description}</td>
                    <td className="p-3 border border-gray-300">
                      {ticket.user && ticket.user.username ? (
                        <>
                          <p className="font-medium">{ticket.user.username}</p>
                          <p className="text-gray-600 text-sm">{ticket.user.email}</p>
                        </>
                      ) : (
                        <p className="text-gray-500">Unknown User</p>
                      )}
                    </td>
                    <td className="p-3 border border-gray-300">
                      {ticket.attachments?.length > 0 ? (
                        <ul>
                          {ticket.attachments.map((file, idx) => (
                            <li key={idx}>
                              <a
                                href={`http://localhost:3000/uploads/${file.filename}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                Attachment {idx + 1} 📎
                              </a>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500">No Attachments</p>
                      )}
                    </td>
                    <td className="p-3 border border-gray-300">
                      <span
                        className={`px-3 py-1 rounded-full text-white ${
                          ticket.status === "Open"
                            ? "bg-green-500"
                            : ticket.status === "In Progress"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                        style={{ whiteSpace: 'nowrap' }}

                      >
                        
                        {ticket.status}
                      </span>
                    </td>
                    <td className="p-3 border border-gray-300">
                      {ticket.assignedTo && ticket.assignedTo.username ? (
                        <p className="font-medium">{ticket.assignedTo.username}</p>
                      ) : (
                        <p className="text-gray-500">Not Assigned</p>
                      )}
                    </td>
                    <td className="p-3 border border-gray-300">
                      {new Date(ticket.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default TicketHistory;
