const { Server } = require("socket.io");
const { getSession, saveMessage } = require("./controllers/chatController");
const jwt = require("jsonwebtoken");
const config = require("./config");

const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: config.cors.origin,
      credentials: true,
    },
  });

  // Simple authentication middleware for sockets
  io.use((socket, next) => {
    // In a real app we'd parse the cookie here or use auth headers.
    // For simplicity we'll pass token in handshake query.
    const token = socket.handshake.query.token;
    if (token) {
      jwt.verify(token, config.jwt.secret, (err, decoded) => {
        if (err) return next(new Error("Authentication error"));
        socket.user = decoded;
        next();
      });
    } else {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", async (socket) => {
    console.log(`User connected to chat: ${socket.user.id}`);

    let activeSession = null;

    if (socket.user.role === "user") {
      activeSession = await getSession(socket.user.id);
      socket.join(activeSession.sessionId); // User joins their room

      // Also join an 'admins' room if admin, or notify admins
      io.to("admins").emit("user_connected", {
        userId: socket.user.id,
        sessionId: activeSession.sessionId,
      });
    } else {
      // Admins join an admins room to receive all notifications
      socket.join("admins");
    }

    socket.on("send_message", async (data) => {
      // data: { content, sessionId (if admin) }
      try {
        const sessionId =
          socket.user.role === "user" ? activeSession.id : data.sessionId;
        const roomName =
          socket.user.role === "user"
            ? activeSession.sessionId
            : data.sessionCode;

        const senderType = socket.user.role === "user" ? "user" : "admin";

        const message = await saveMessage(
          sessionId,
          senderType,
          socket.user.id,
          data.content,
        );

        // Broadcast to the user's specific room
        io.to(roomName).emit("receive_message", message);

        // If user sent it, also notify admins room
        if (senderType === "user") {
          io.to("admins").emit("new_admin_message", {
            ...message,
            sessionCode: roomName,
          });
        }
      } catch (error) {
        console.error("Message error:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.user.id}`);
    });
  });
};

module.exports = { initSocket };
