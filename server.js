const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");

dotenv.config();

const app = express();
const server = http.createServer(app);

// Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.log("❌ MongoDB Connection Failed");
    console.log(err);
  });

// Routes
const authRoutes = require("./routes/auth");
const rideRoutes = require("./routes/ride");
const driverRoutes = require("./routes/driver");

app.use("/api/auth", authRoutes);
app.use("/api/rides", rideRoutes);
app.use("/api/drivers", driverRoutes);

// Home Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    app: "Dabido Backend",
    version: "1.0.0",
    status: "Running"
  });
});

// Socket Events
io.on("connection", (socket) => {
  console.log("🟢 User Connected:", socket.id);

  socket.on("joinRide", (rideId) => {
    socket.join(rideId);
  });

  socket.on("driverLocation", (data) => {
    io.to(data.rideId).emit("liveLocation", data);
  });

  socket.on("rideStatus", (data) => {
    io.to(data.rideId).emit("rideUpdate", data);
  });

  socket.on("disconnect", () => {
    console.log("🔴 User Disconnected:", socket.id);
  });
});

// Start Server
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Dabido Server Running on Port ${PORT}`);
});
