import dns from "node:dns";
import mongoose from "mongoose";

// Fix Atlas SRV resolution on Windows — local routers often block querySrv
// Use Google (8.8.8.8) and Cloudflare (1.1.1.1) DNS that support SRV records
dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
dns.setDefaultResultOrder("ipv4first");

async function dbConnect() {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
  }

  // Use cached connection to avoid creating new connections on every request
  let cached = (global as any).mongoose;
  if (!cached) {
    cached = (global as any).mongoose = { conn: null, promise: null };
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      family: 4,                      // Force IPv4 — avoids ECONNREFUSED dual-stack error
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    }).then((m) => m);
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;