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
// Start server
server.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});