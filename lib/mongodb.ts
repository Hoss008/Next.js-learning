import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local",
  );
}

// Define the shape of the cached connection object
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Extend the global object to persist the cache across hot reloads in development
declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

// Use the cached connection if it exists, otherwise initialize
const cached: MongooseCache = global.mongoose ?? { conn: null, promise: null };

// Store the cache on the global object to survive hot reloads
if (!global.mongoose) {
  global.mongoose = cached;
}

async function connectToDatabase(): Promise<typeof mongoose> {
  // Return the existing connection if already established
  if (cached.conn) {
    return cached.conn;
  }

  // Start a new connection if no pending promise exists
  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false, // Disable buffering so errors surface immediately
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts);
  }

  try {
    // Await the connection and cache it
    cached.conn = await cached.promise;
  } catch (error) {
    // Reset the promise so the next call retries the connection
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

export default connectToDatabase;
