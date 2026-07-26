require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// ======================
// Middleware
// ======================

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static Files
app.use(express.static("public"));

// ======================
// MongoDB Connection
// ======================

mongoose.connect(process.env.MONGO_URI)
.then(() => {

    console.log("✅ MongoDB Connected");

})
.catch(err => {

    console.log(err);

});

// ======================
// Routes
// ======================

app.use("/api/auth", require("./routes/auth"));

app.use("/api/rides", require("./routes/ride"));

app.use("/api/rider", require("./routes/rider"));

app.use("/api/admin", require("./routes/admin"));

// ======================
// Home Route
// ======================

app.get("/", (req, res) => {

    res.send("🚖 Dabido Backend Running");

});

// ======================
// Socket.IO
// ======================

io.on("connection", (socket) => {

    console.log("User Connected :", socket.id);

    socket.on("joinRider", riderId => {

        socket.join("rider-" + riderId);

    });

    socket.on("joinUser", userId => {

        socket.join("user-" + userId);

    });

    socket.on("rideRequest", data => {

        io.emit("newRide", data);

    });

    socket.on("rideAccepted", data => {

        io.to("user-" + data.userId)
        .emit("rideAccepted", data);

    });

    socket.on("rideStarted", data => {

        io.to("user-" + data.userId)
        .emit("rideStarted", data);

    });

    socket.on("rideCompleted", data => {

        io.to("user-" + data.userId)
        .emit("rideCompleted", data);

    });

    socket.on("driverLocation", data => {

        io.to("user-" + data.userId)
        .emit("driverLocation", data);

    });

    socket.on("disconnect", () => {

        console.log("User Disconnected");

    });

});

// ======================
// Start Server
// ======================

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {

    console.log("🚀 Server Running On Port", PORT);

});
