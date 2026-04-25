import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import connectDB from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

await connectDB();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
  }
});

app.set("io", io);

io.on("connection", (socket) => {
  socket.on("join-user-room", (userId) => {
    if (userId) socket.join(`user-${userId}`);
  });

  socket.on("disconnect", () => {
    // noop
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
