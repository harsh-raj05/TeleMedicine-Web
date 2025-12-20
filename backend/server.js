const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const Chat = require("./models/Chat");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Test route
app.get("/", (req, res) => {
  res.send("Telemedicine Backend API Running");
});

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/appointments", require("./routes/appointmentRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));
app.use("/api/profile", require("./routes/profileRoutes"));
app.use("/api/chat", require("./routes/chatRoutes"));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for simplicity in dev
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  // User joins their own room (based on userId)
  socket.on("join_room", (userId) => {
    socket.join(userId);
    console.log(`User with ID: ${socket.id} joined room: ${userId}`);
  });

  // Handle sending messages
  socket.on("send_message", async (data) => {
    const { sender, receiver, message, fileUrl, fileType } = data;

    // Save to DB
    try {
      const newChat = new Chat({ sender, receiver, message, fileUrl, fileType });
      await newChat.save();

      // Emit to receiver's room
      io.to(receiver).emit("receive_message", data);

      // Emit back to sender (confirm sent)
      io.to(sender).emit("receive_message", data);

    } catch (err) {
      console.error("Error saving message:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
