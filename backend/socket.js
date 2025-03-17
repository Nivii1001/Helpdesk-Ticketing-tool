const socketIo = require("socket.io");

let io;
module.exports = {
  init: (server) => {
    io = socketIo(server, {
      cors: { origin: "*" }, // Allow frontend connections
    });
    return io;
  },
  getIO: () => {
    if (!io) throw new Error("Socket.io not initialized");
    return io;
  },
};
