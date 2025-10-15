"use server";

import { Watchlist } from "@/database/models/watchlist.model";
import { connectToDatabase } from "@/database/mongoose";

// This function retrieves all users with valid email addresses
// from the 'user' collection in MongoDB — specifically for sending newsletters.
export const getAllUsersForNewsEmail = async() => {
    try {
        const mongoose = await connectToDatabase(); // Establish connection to MongoDB using the custom connection helper
        const db = mongoose.connection.db;
        if(!db) throw Error('Mongoose connection not established')
        // Fetch users who have an existing, non-null email address
        // Only return selected fields for efficiency (no sensitive data)
        const users = await db.collection('user').find(
            { email: { $exists: true, $ne: null }},
            { projection: { _id: 1, id: 1, email: 1, name: 1, country:1 }} // Limit fields returned
        ).toArray(); 

        // Filter out users without names or emails, then format the data
        return users.filter((user) => user.email && user.name).map((user) => ({
            id: user.id || user._id?.toString() || '', // Use `id` or fallback to Mongo `_id`
            email: user.email,
            name: user.name
        }))
    } catch (e) {
        console.log('Error fetching users for news email: ', e);
        return []; // Return an empty array to prevent crashes in case of failure
    }
}

/**
 * Add a stock to the user's watchlist
 */
export const addToWatchlist = async (userId: string, symbol: string, company: string) => {
  if (!userId || !symbol) return { success: false, message: "Missing parameters" };

  try {
    await connectToDatabase();

    const existing = await Watchlist.findOne({ userId, symbol });
    if (existing) {
      return { success: true, message: "Already in watchlist" };
    }

    await Watchlist.create({
      userId,
      symbol,
      company,
      createdAt: new Date(),
    });

    return { success: true, message: "Added to watchlist" };
  } catch (error) {
    console.error("addToWatchlist error:", error);
    return { success: false, message: "Database error" };
  }
};

/**
 * Remove a stock from the user's watchlist
 */
export const removeFromWatchlist = async (userId: string, symbol: string) => {
  if (!userId || !symbol) return { success: false, message: "Missing parameters" };

  try {
    await connectToDatabase();
    await Watchlist.deleteOne({ userId, symbol });
    return { success: true, message: "Removed from watchlist" };
  } catch (error) {
    console.error("removeFromWatchlist error:", error);
    return { success: false, message: "Database error" };
  }
};