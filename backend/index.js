import express from "express";
import dotenv from "dotenv";
import connectDb from "./database/db.js";
import cookieParser from "cookie-parser";
import cloudinary from "cloudinary";
import path from "path";
import http from "http"; // Import HTTP module for Socket.IO
import { Server } from "socket.io"; // Import Socket.IO
import mongoose from "mongoose";
import { ChatMessage } from "./models/ChatMessage.js"; // Import ChatMessage model
import { Album } from "./models/Album.js"; // Import Album model
import { Song } from "./models/Song.js"; // Import Song model

dotenv.config();

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.Cloud_Name,
  api_key: process.env.Cloud_Api,
  api_secret: process.env.Cloud_Secret,
});

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

const port = process.env.PORT || 5000;

// Import routes
import userRoutes from "./routes/userRoutes.js";
import songRoutes from "./routes/songRoutes.js";

// Use routes
app.use("/api/user", userRoutes);
app.use("/api/song", songRoutes);

// Delete Album Route
app.delete("/api/album/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Check if the album exists
    const album = await Album.findById(id);
    if (!album) {
      return res.status(404).json({ message: "Album not found" });
    }

    // Delete all songs associated with the album (optional)
    await Song.deleteMany({ album: id });

    // Delete the album
    await Album.findByIdAndDelete(id);

    res.status(200).json({ message: "Album deleted successfully" });
  } catch (error) {
    console.error("Error deleting album:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Serve static files (React frontend)
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "/frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Replace with your frontend URL
    methods: ["GET", "POST"],
  },
});

// Store active users
const activeUsers = new Map();

// Handle socket connections
io.on("connection", async (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Fetch chat history and send it to the newly connected user
  const chatHistory = await ChatMessage.find().sort({ timestamp: 1 });
  socket.emit("getChatHistory", chatHistory);

  // Add user to active users
  socket.on("addUser", (userId) => {
    activeUsers.set(userId, socket.id);
    io.emit("getActiveUsers", Array.from(activeUsers.keys())); // Broadcast active users
  });

  // Send message to all users (group chat)
  socket.on("sendMessage", async ({ senderId, senderName, message }) => {
    const newMessage = new ChatMessage({
      senderId,
      senderName,
      message,
    });
    await newMessage.save(); // Save the message to the database
    io.emit("getMessage", {
      senderId,
      senderName,
      message,
      timestamp: newMessage.timestamp,
    });
  });

  // Remove user from active users
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    for (let [userId, socketId] of activeUsers.entries()) {
      if (socketId === socket.id) {
        activeUsers.delete(userId);
        io.emit("getActiveUsers", Array.from(activeUsers.keys())); // Broadcast updated active users
        break;
      }
    }
  });
});

// Start the server
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  connectDb();
});