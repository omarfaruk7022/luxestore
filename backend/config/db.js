import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("Please define MONGO_URI");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn; // ⭐ already connected

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI, {
      bufferCommands: false,
      maxPoolSize: 10,          // reuse up to 10 connections
      serverSelectionTimeoutMS: 5000,  // fail fast if DB unreachable
      socketTimeoutMS: 45000,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;
