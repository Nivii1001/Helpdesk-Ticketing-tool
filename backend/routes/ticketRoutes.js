const express = require("express");
const mongoose = require("mongoose"); 
const User = require("../models/User"); 
const multer = require("multer");
const { authMiddleware, authorizeRoles } = require("../middleware/authMiddleware");
const Ticket = require("../models/Ticket");

const router = express.Router();

// Configure Multer for File Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save files to "uploads" folder
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique filenames
  },
});
const upload = multer({ 
  storage, 
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/") || file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only images and PDFs are allowed!"), false);
    }
  }
});


// Helper function to generate a unique ticket ID
const generateTicketId = () => `TKT-${Date.now()}`;

// Create Ticket Route - Only Authenticated Users
router.post("/create", authMiddleware, upload.array("attachments", 5), async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    console.log("Uploaded Files:", req.files);

    const { title, description } = req.body;
    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required." });
    }

    const ticketId = generateTicketId();

    const newTicket = new Ticket({
      createdBy: req.user._id, // Ensure `createdBy` is set correctly
      title,
      description,
      user: req.user._id,
      ticketId,
      attachments: req.files.map((file) => ({
        filename: file.filename, // Use the new disk-stored filename
        mimetype: file.mimetype,
        size: file.size,
        path: `/uploads/${file.filename}`, // Store the file path
      })),
    });
    
    await newTicket.save();
    res.status(201).json({ message: "Ticket created successfully!", ticketId });
  } catch (error) {
    console.error("Error creating ticket:", error);
    res.status(500).json({ message: "Error creating ticket", error: error.message });
  }
});

// Get All Tickets - Only Support Agents & Admins
router.get("/all", authMiddleware, authorizeRoles("Support Agent", "Admin"), async (req, res) => {
  try {
    console.log("Authenticated User:", req.user);
    const tickets = await Ticket.find().populate("user", "username email");
    console.log("Fetched Tickets:", tickets);

    res.json(tickets);
  } catch (error) {
    console.error("Error fetching tickets:", error);
    res.status(500).json({ message: "Error fetching tickets" });
  }
});
// Fetch all support agents
router.get("/agents", async (req, res) => {
  try {
    console.log("Fetching support agents...");

    // Check DB connection
    if (!mongoose.connection.readyState) {
      console.error("Database is not connected");
      return res.status(500).json({ message: "Database connection error" });
    }

    // Fetch agents
    const agents = await User.find({ role: "Support Agent" }).select("username email");
    
    console.log("Agents found:", agents);

    if (agents.length === 0) {
      return res.status(404).json({ message: "No support agents found" });
    }

    res.json(agents);
  } catch (error) {
    console.error("Error fetching agents:", error);
    res.status(500).json({ message: "Error fetching agents", error: error.message });
  }
});


// Assign ticket to a support agent
router.put("/assign/:ticketId", authMiddleware, authorizeRoles("Admin"), async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { assignedTo } = req.body;

    console.log("Assigning Ticket:", ticketId, "to Agent:", assignedTo);

    let ticket = await Ticket.findById(ticketId) || await Ticket.findOne({ ticketId });

    if (!ticket) {
      console.error(" Ticket not found:", ticketId);
      return res.status(404).json({ message: "Ticket not found" });
    }

    console.log("Ticket Found:");

    if (!mongoose.Types.ObjectId.isValid(assignedTo)) {
      console.error("Invalid Agent ID:", assignedTo);
      return res.status(400).json({ message: "Invalid support agent ID" });
    }

    const agent = await User.findById(assignedTo);
    if (!agent || agent.role !== "Support Agent") {
      console.error("Invalid or non-agent user:", assignedTo);
      return res.status(400).json({ message: "Invalid support agent" });
    }

    // Assign ticket and disable validation for missing fields
    ticket.assignedTo = assignedTo;
    await ticket.save({ validateBeforeSave: false });

    console.log(" Ticket assigned successfully:", ticket);
    res.json({ message: "Ticket assigned successfully", ticket });

  } catch (error) {
    console.error(" Error assigning ticket:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


// Get User's Tickets - Only Authenticated Users
router.get("/my-tickets", authMiddleware, async (req, res) => {
  try {
    const userTickets = await Ticket.find({ user: req.user._id })
      .populate("assignedTo", "username email") // Populate assigned agent details
      .populate("user", "username email"); // Populate user details

    res.json(userTickets);
  } catch (error) {
    console.error("Error fetching user's tickets:", error);
    res.status(500).json({ message: "Error fetching tickets" });
  }
});

// ==================== UPDATE TICKET STATUS ====================
router.put("/status/:ticketId", authMiddleware, async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { status } = req.body;

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    ticket.status = status;
    await ticket.save();

    // Notify admin & user about status update via WebSocket
    io.getIO().emit("ticketStatusUpdated", { ticketId, status });

    res.json({ message: "Ticket status updated successfully", ticket });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
