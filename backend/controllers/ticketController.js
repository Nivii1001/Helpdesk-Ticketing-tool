const Ticket = require("../models/Ticket");
const { v4: uuidv4 } = require("uuid");

const createTicket = async (req, res) => {
  try {
    console.log(" Incoming Ticket Data:", req.body); // Log request body

    const { title, description, attachments } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }

    const newTicket = new Ticket({
      user: req.user.id,
      title,
      description,
      attachments: attachments || [], // Ensure it's an array
      ticketId: uuidv4(), // Generate unique ticket ID
    });

    await newTicket.save();
    console.log("Ticket saved successfully:", newTicket); // Log successful save

    res.status(201).json({ message: "Ticket created successfully", ticket: newTicket });
  } catch (error) {
    console.error(" Error in createTicket:", error); // Log full error
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { createTicket };
