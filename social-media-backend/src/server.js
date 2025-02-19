import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer } from "node:http"; // ✅ Correct way to import http in ES Modules
import { Server } from "socket.io";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import bookmarkRoutes from "./routes/bookmarkRoutes.js";
import path from "path";


dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(cookieParser());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/bookmarks", bookmarkRoutes);

// ✅ Create HTTP Server Correctly in ES Modules
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Allow frontend connection
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("send_notification", (data) => {
    console.log("New Notification:", data);
    io.emit("receive_notification", data); // Broadcast notification
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// ✅ Use `server.listen` Instead of `app.listen`
const PORT = process.env.PORT || 5050;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
