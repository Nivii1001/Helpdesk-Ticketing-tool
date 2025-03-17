// const mongoose = require("mongoose");
const mongoose = require("mongoose");
const User = require("../models/User"); // Ensure correct path

const TicketSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    attachments: {
      type: Array,
      default: [],
    },
    ticketId: {
      type: String,
      unique: true,
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId,
       ref: "User", 
       required: true 
      },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      default: null 
    }, // Assigned agen
    status: {
      type: String,
      enum: ["Open", "In Progress", "Resolved"],
      default: "Open",
    },
  },
  { timestamps: true }
);

// Generate ticketId if not provided
TicketSchema.pre("save", function (next) {
  if (!this.ticketId) {
    this.ticketId = `TKT-${Date.now()}`;
  }
  next();
});

module.exports = mongoose.model("Ticket", TicketSchema);
