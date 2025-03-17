const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");
const http = require("http"); // Import HTTP module
const { Server } = require("socket.io"); // Import Socket.io

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Create HTTP server for Socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Change to match your frontend URL
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Socket.io setup
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Listen for ticket assignments
  socket.on("assignTicket", (ticket) => {
    console.log("Ticket assigned:", ticket);
    io.emit("ticketAssigned", ticket); // Broadcast update to all clients
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Routes
const authRoutes = require("./routes/authroutes");
const ticketRoutes = require("./routes/ticketRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB Atlas");
    server.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Connection Failed:", error.message);
    process.exit(1);
  });
