import { betterAuth } from "better-auth";
import { mongodbAdapter} from "better-auth/adapters/mongodb";
import { connectToDatabase} from "@/database/mongoose";
import { nextCookies} from "better-auth/next-js";

// Declare a variable to hold a single instance of the Better Auth configuration.
// This prevents multiple instances from being created across server reloads.
let authInstance: ReturnType<typeof betterAuth> | null = null;

/**
 * Initializes and returns a singleton Better Auth instance.
 * - Ensures MongoDB is connected.
 * - Configures the authentication system with database, secrets, and plugins.
 * - Caches the instance to avoid reinitialization.
 */
export const getAuth = async () => {
    // If an instance already exists, return it (singleton pattern)
    if(authInstance) return authInstance;

    const mongoose = await connectToDatabase(); // Establish a MongoDB connection using Mongoose
    const db = mongoose.connection.db;

    if(!db) throw new Error('MongoDB connection not found');

    // Create and configure the Better Auth instance
    authInstance = betterAuth({
        database: mongodbAdapter(db as any),
        secret: process.env.BETTER_AUTH_SECRET,
        baseURL: process.env.BETTER_AUTH_URL,
        // Configuration for email + password-based authentication
        emailAndPassword: {
            enabled: true,
            disableSignUp: false,
            requireEmailVerification: false,
            minPasswordLength: 8,
            maxPasswordLength: 128,
            autoSignIn: true,
        },
        plugins: [nextCookies()], // Add Next.js cookies plugin for managing sessions in Next.js apps
    });

    return authInstance;
}

export const auth = await getAuth();