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

// Start server
server.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});