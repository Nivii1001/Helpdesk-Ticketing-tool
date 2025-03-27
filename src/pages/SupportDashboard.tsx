import React, { useEffect, useState } from 'react';

const API_URL = "http://localhost:3000/api";

const SupportDashboard = () => {
    const [agentTickets, setAgentTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [ticketComments, setTicketComments] = useState([]);
    const [newCommentText, setNewCommentText] = useState("");

    useEffect(() => {
        fetchAgentTickets();
    }, []);

    const fetchAgentTickets = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            if (!token) {
                setError("Please log in to view your tickets.");
                return;
            }
            const response = await fetch(`${API_URL}/tickets/agent/tickets`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to fetch tickets.");
            }
            const data = await response.json();
            setAgentTickets(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (ticketId, newStatus) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("Please log in to update status.");
                return;
            }
            const response = await fetch(`${API_URL}/tickets/status/${ticketId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status: newStatus }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to update status.");
            }
            fetchAgentTickets();
            if (selectedTicket && selectedTicket._id === ticketId) {
                fetchTicketDetails(ticketId);
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const fetchTicketDetails = async (ticketId) => {
        if (selectedTicket && selectedTicket._id === ticketId) {
            setSelectedTicket(null);
            setTicketComments([]);
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_URL}/tickets/${ticketId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!response.ok) {
                throw new Error("Failed to fetch ticket details.");
            }
            const data = await response.json();
            setSelectedTicket(data.ticket);
            setTicketComments(data.comments);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleAddComment = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_URL}/tickets/${selectedTicket._id}/comments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ text: newCommentText })
            });
            if (!response.ok) {
                throw new Error("Failed to add comment.");
            }
            setNewCommentText("");
            fetchTicketDetails(selectedTicket._id);
        } catch (error) {
            setError(error.message);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Assigned Tickets</h2>
            {agentTickets.length > 0 ? (
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border p-2">Ticket ID</th>
                            <th className="border p-2">Title</th>
                            <th className="border p-2">Status</th>
                            <th className="border p-2">Created By</th>
                            <th className="border p-2">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {agentTickets.map((ticket) => (
                            <tr
                                key={ticket._id}
                                className="border cursor-pointer hover:bg-gray-50"
                                onClick={() => fetchTicketDetails(ticket._id)}
                            >
                                <td className="p-2 border">{ticket.ticketId}</td>
                                <td className="p-2 border">
                                    {ticket.title}
                                    <br />
                                    <span className="text-blue-600 hover:underline text-sm">Click for Details</span>
                                </td>
                                <td className="p-2 border">
                                    <span
                                        style={{ whiteSpace: 'nowrap' }}
                                        className={`px-3 py-1 rounded-full text-white ${ticket.status === "Open" ? "bg-green-500" : ticket.status === "In Progress" ? "bg-yellow-500" : "bg-red-500"}`}
                                    >
                                        {ticket.status}
                                    </span>
                                </td>
                                <td className="p-2 border">{ticket.user?.username}</td>
                                <td className="p-2 border">
                                    <select
                                        value={ticket.status}
                                        onChange={(e) => handleStatusChange(ticket._id, e.target.value)}
                                    >
                                        <option value="Open">Open</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Closed">Closed</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No assigned tickets.</p>
            )}

            {selectedTicket && (
                <div className="mt-4">
                    <h3 className="text-lg font-semibold">Ticket Details</h3>
                    <p>Description: {selectedTicket.description}</p>
                    <p>Created By: {selectedTicket.user?.username}</p>
                    {selectedTicket.attachments?.length > 0 ? (
                        <ul>
                            {selectedTicket.attachments.map((file, idx) => (
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

                    <h4 className="text-md font-semibold mt-2">Comments</h4>
                    <ul>
                        {ticketComments.map((comment) => (
                            <li key={comment._id}>
                                {comment.user?.username}: {comment.text}
                            </li>
                        ))}
                    </ul>
                    <textarea value={newCommentText} onChange={(e) => setNewCommentText(e.target.value)} placeholder="Add a comment" className="w-full border p-2 mt-2"></textarea>
                    <button onClick={handleAddComment} className="bg-blue-500 text-white p-2 mt-2">Add Comment</button>
                </div>
            )}
        </div>
    );
};

export default SupportDashboard;