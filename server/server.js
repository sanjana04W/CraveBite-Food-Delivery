import dns from "node:dns";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import clientRoutes from "./routes/clients.js";
import { seedAdmin } from "./utils/seedAdmin.js";

dns.setDefaultResultOrder("ipv4first");
dns.setServers(["1.1.1.1", "8.8.8.8"]);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:3001";

// Database Connection Helper (Works for both Local and Vercel Serverless)
let isConnected = false;
async function connectDB() {
  if (isConnected || mongoose.connection.readyState >= 1) {
    return;
  }
  if (!MONGO_URI) {
    console.error("❌ Error: MONGO_URI is missing in environment variables!");
    return;
  }
  try {
    await mongoose.connect(MONGO_URI);
    isConnected = true;
    console.log("✅ Connected to MongoDB Atlas");
    await seedAdmin();
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
  }
}

// Middleware to ensure DB connection on each request
app.use(async (_req, _res, next) => {
  await connectDB();
  next();
});

app.use(
  cors({
    origin: [
      CLIENT_ORIGIN,
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
      "http://127.0.0.1:3001",
    ],
    credentials: true,
  })
);
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("API is running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/clients", clientRoutes);

// Only listen on port when running locally (Vercel manages the server in production)
if (!process.env.VERCEL) {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  });
}

export default app;
