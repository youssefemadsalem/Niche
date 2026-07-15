import mongoose from "mongoose";

// 1. Keep the declaration at the top level, but do not crash here if it is undefined
const MONGODB_URI = process.env.MONGODB_URI;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongoose ?? { conn: null, promise: null };
global.mongoose = cached;

export async function connectDB() {
  if (cached.conn) return cached.conn;

  // 2. Safely throw the error inside the execution block only when called
  if (!MONGODB_URI) {
    throw new Error(
      "Please define the MONGODB_URI environment variable in your configuration (.env.local)",
    );
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}