import { useEffect, useState } from "react";

const SupportDashboard = () => {
    const [tickets, setTickets] = useState([]);
  
    useEffect(() => {
      fetchTickets();
  
      // Listen for real-time ticket updates
      socket.on("ticketStatusUpdated", (data) => {
        setTickets((prev) =>
          prev.map((ticket) =>
            ticket._id === data.ticketId ? { ...ticket, status: data.status } : ticket
          )
        );
      });
    }, []);
  
    const fetchTickets = async () => {
      const res = await fetch("http://localhost:3000/api/tickets/assigned");
      const data = await res.json();
      setTickets(data);
    };
  
    return (
      <div>
        <h1>Support Agent Dashboard</h1>
        {tickets.map((ticket) => (
          <div key={ticket._id}>
            <h3>{ticket.title}</h3>
            <p>Status: {ticket.status}</p>
          </div>
        ))}
      </div>
    );
  };
  
  export default SupportDashboard;
  