// UserDashboard.tsx
import React, { useEffect, useState } from 'react';

const API_URL = "http://localhost:3000/api"; 

const TicketStatus = () => {
    const [userTickets, setUserTickets] = useState([]);

    useEffect(() => {
        fetchUserTickets();
    }, []);

    const fetchUserTickets = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Please log in to view your tickets.");
                return;
            }

            const response = await fetch(`${API_URL}/tickets/my-tickets`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to fetch tickets.");
            }

            const data = await response.json();
            setUserTickets(data);
        } catch (error) {
            console.error("Error fetching user tickets:", error);
            alert(`Error: ${error.message}`);
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Your Tickets</h2>
            {userTickets.length > 0 ? (
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border p-2">Ticket ID</th>
                            <th className="border p-2">Title</th>
                            <th className="border p-2">Status</th>
                            <th className="border p-2">Assigned To</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userTickets.map((ticket) => (
                            <tr key={ticket._id} className="border">
                                <td className="p-2 border">{ticket.ticketId}</td>
                                <td className="p-2 border">{ticket.title}</td>
                                <td className="p-2 border">
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
                                <td className="p-2 border">{ticket.assignedTo?.username || "Not Assigned"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>You have no tickets.</p>
            )}
        </div>
    );
};

export default TicketStatus;