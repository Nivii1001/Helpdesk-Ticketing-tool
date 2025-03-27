const express = require("express");
const mongoose = require("mongoose"); 
const User = require("../models/User"); 
const multer = require("multer");
const { authMiddleware, authorizeRoles } = require("../middleware/authMiddleware");
const Ticket = require("../models/Ticket");
const  Comment= require("../models/Comment");
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); 
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); 
  },
});
const upload = multer({ 
  storage, 
  limits: { fileSize: 5 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/") || file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only images and PDFs are allowed!"), false);
    }
  }
});


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
      createdBy: req.user._id, 
      title,
      description,
      user: req.user._id,
      ticketId,
      attachments: req.files.map((file) => ({
        filename: file.filename, 
        mimetype: file.mimetype,
        size: file.size,
        path: `/uploads/${file.filename}`, 
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
        const tickets = await Ticket.find()
            .populate("user", "username email")
            .populate({
                path: "assignedTo",
                select: "username email",
                model: "User",
            }); 

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

    if (!mongoose.connection.readyState) {
      console.error("Database is not connected");
      return res.status(500).json({ message: "Database connection error" });
    }

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

// Get Unassigned Tickets for Assignment
router.get("/unassigned", authMiddleware, authorizeRoles("Admin"), async (req, res) => {
    try {
        const unassignedTickets = await Ticket.find({ assignedTo: null })
            .populate("user", "username email");

        res.json(unassignedTickets);
    } catch (error) {
        console.error("Error fetching unassigned tickets:", error);
        res.status(500).json({ message: "Error fetching unassigned tickets", error: error.message });
    }
});

// Modify the assign route to update status
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

        ticket.assignedTo = assignedTo;
        ticket.status = "In Progress";
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
      .populate({
        path: "assignedTo",
        select: "username email", 
        model: "User", 
      })
      .populate({
        path: "user",
        select: "username email",
      });

    console.log("Fetched Tickets:", JSON.stringify(userTickets, null, 2)); 

    res.json(userTickets);
  } catch (error) {
    console.error("Error fetching user's tickets:", error);
    res.status(500).json({ message: "Error fetching tickets" });
  }
});

router.get("/agent/tickets", authMiddleware, authorizeRoles("Support Agent"), async (req, res) => {
  try {
      const agentTickets = await Ticket.find({ assignedTo: req.user._id })
          .populate("user", "username email");

      res.json(agentTickets);
  } catch (error) {
      console.error("Error fetching agent tickets:", error);
      res.status(500).json({ message: "Error fetching agent tickets", error: error.message });
  }
});
// ==================== UPDATE TICKET STATUS ====================
router.put("/status/:ticketId", authMiddleware, async (req, res) => {
  try {
      const { ticketId } = req.params;
      const { status } = req.body;

      console.log("Updating ticket status:", ticketId, status);
      console.log("Request user:", req.user); 

      const ticket = await Ticket.findById(ticketId);
      if (!ticket) {
          console.log("Ticket not found:", ticketId);
          return res.status(404).json({ message: "Ticket not found" });
      }

      console.log("Ticket found:", ticket); 

      ticket.status = status;
      await ticket.save();

      console.log("Ticket status updated successfully:", ticketId, status);

      res.json({ message: "Ticket status updated successfully", ticket });
  } catch (error) {
      console.error("Error updating ticket status:", error);
      res.status(500).json({ message: "Server error", error: error.message });
  }
});
// Get single ticket details and comments
router.get("/:ticketId", authMiddleware, async (req, res) => {
  try {
      const ticket = await Ticket.findById(req.params.ticketId)
          .populate('user')
          .populate('assignedTo');

      if (!ticket) {
          return res.status(404).json({ message: "Ticket not found" });
      }

      const comments = await Comment.find({ ticket: req.params.ticketId })
          .populate('user');

      res.json({ ticket, comments });
  } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Create a comment
router.post("/:ticketId/comments", authMiddleware, async (req, res) => {
  try {
      const { text } = req.body;
      if (!text || text.trim() === "") {
          return res.status(400).json({ message: "Comment text is required." });
      }
      const newComment = new Comment({
          text: text,
          user: req.user._id,
          ticket: req.params.ticketId,
      });

      await newComment.save();

      res.status(201).json(newComment);
  } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
