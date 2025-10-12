import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URL; // Get MongoDB connection URI from environment variables

// Extend the global object to store a cached MongoDB connection and promise.
declare global {
    var mongooseCache: {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
    }
}

// Initialize the cache object from global scope if it exists, otherwise create a new one.
let cached = global.mongooseCache;
if(!cached) {
    cached = global.mongooseCache = {conn:null, promise: null};
}

/**
 * Connects to MongoDB using Mongoose.
 * - Uses a global cache to avoid reconnecting multiple times.
 * - Returns the active connection once established.
 */
export const connectToDatabase = async () => {
    // Ensure MongoDB URI is defined
    if(!MONGODB_URI) throw new Error('MONGODB_URL must be set within .env');

    // If connection already exists, reuse it
    if(cached.conn) return cached.conn;

    // If there’s no existing connection promise, create one
    if(!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI, {bufferCommands : false})
    }
    // Attempt to establish a connection
    try {
        cached.conn = await cached.promise;
    } catch (err) {
        // Reset promise if connection fails
        cached.promise = null;
        throw err;
    }
    console.log(`Connected to database ${process.env.NODE_ENV} - ${MONGODB_URI}`);

    return cached.conn
}