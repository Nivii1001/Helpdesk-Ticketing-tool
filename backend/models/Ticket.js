const mongoose = require("mongoose");
const User = require("../models/User");

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
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
      },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      default: null 
    }, 

    status: {
      type: String,
      enum: ["Open", "In Progress", "Closed"],
      default: "Open",
    },
  },
  { timestamps: true }
);

TicketSchema.pre("save", function (next) {
  if (!this.ticketId) {
    this.ticketId = `TKT-${Date.now()}`;
  }
  next();
});

module.exports = mongoose.model("Ticket", TicketSchema);
