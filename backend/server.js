require('dotenv').config();

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
  }
});

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// MongoDB Setup
const client = new MongoClient(process.env.MONGO_URI);
let requestsCollection;

async function connectDB() {
  try {
    await client.connect();
    const db = client.db("disasterResponse");
    requestsCollection = db.collection("requests");
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error);
  }
}

connectDB();

// Basic route
app.get('/', (req, res) => {
  res.send("🚀 Server Running");
});
app.post('/requests', async (req, res) => {
  try {
    const data = req.body;

    if (!data.requestID || !data.coords) {
      return res.status(400).json({ error: "Invalid request data" });
    }

    data.status = data.status || "Pending";
    data.createdAt = new Date();

    await requestsCollection.insertOne(data);
    io.emit("new-request",data);
    res.status(201).json({
      message: "Emergency request saved",
      requestID: data.requestID
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});
app.get('/requests', async (req, res) => {
  try {
    const requests = await requestsCollection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    res.json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch requests" });
  }
});
app.patch('/requests/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }

    const result = await requestsCollection.updateOne(
      { requestID: id },
      { 
        $set: { 
          status,
          statusUpdatedAt: new Date()
        } 
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Request not found" });
    }

    // 🔔 Notify victim + responders in real-time
    io.emit("status-update", {
      requestID: id,
      status
    });

    res.json({ message: "Status updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update status" });
  }
});
io.on("connection", (socket) => {
  console.log("🟢 Client connected:", socket.id);

  socket.on("location-update", async (data) => {
    const { requestID, coords } = data;

    if (!requestID || !coords) return;

    await requestsCollection.updateOne(
      { requestID },
      { $set: { coords, lastUpdated: new Date() } }
    );

    io.emit("location-update", data);
  });

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
  });
});
// Start server
server.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});