"use server";

import { connectToDatabase } from "@/database/mongoose";
import { Watchlist } from "@/database/models/watchlist.model";

/**
 * Add a stock to the user's watchlist
 */
export const addToWatchlist = async (userId: string, symbol: string, company: string) => {
  if (!userId || !symbol) {
    return { success: false, message: "Missing parameters" };
  }

  try {
    await connectToDatabase();

    // Try to create a new entry — Mongo will throw if it already exists due to unique index
    const item = await Watchlist.create({
      userId,
      symbol: symbol.toUpperCase(),
      company,
      addedAt: new Date(),
    });

    return { success: true, message: "Added to watchlist", data: item };
  } catch (error: any) {
    if (error.code === 11000) {
      // Duplicate key error from Mongo (user already added this stock)
      return { success: true, message: "Already in watchlist" };
    }
    console.error("addToWatchlist error:", error);
    return { success: false, message: "Database error" };
  }
};

/**
 * Remove a stock from the user's watchlist
 */
export const removeFromWatchlist = async (userId: string, symbol: string) => {
  if (!userId || !symbol) {
    return { success: false, message: "Missing parameters" };
  }

  try {
    await connectToDatabase();
    await Watchlist.deleteOne({ userId, symbol: symbol.toUpperCase() });
    return { success: true, message: "Removed from watchlist" };
  } catch (error) {
    console.error("removeFromWatchlist error:", error);
    return { success: false, message: "Database error" };
  }
};

/**
 * Get all symbols in the user's watchlist
 */
export const getUserWatchlist = async (userId: string) => {
  if (!userId) return [];
  try {
    await connectToDatabase();
    const items = await Watchlist.find({ userId }).lean();

    return items.map((item) => ({
      _id: item._id.toString(),
      symbol: item.symbol,
      company: item.company,
      addedAt: item.addedAt,
    }));
  } catch (error) {
    console.error("getUserWatchlist error:", error);
    return [];
  }
};
/**
 * Get all watchlist symbols by user email (used by automated email/news jobs)
 */
export const getWatchlistSymbolsByEmail = async (email: string): Promise<string[]> => {
  if (!email) return [];

  try {
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) throw new Error("MongoDB connection not found");

    // Find the user by email in the "user" collection
    const user = await db.collection("user").findOne<{ _id?: unknown; id?: string; email?: string }>({ email });
    if (!user) return [];

    const userId = (user.id as string) || String(user._id || "");
    if (!userId) return [];

    // Get their watchlist items
    const items = await Watchlist.find({ userId }, { symbol: 1 }).lean();
    return items.map((i) => String(i.symbol));
  } catch (err) {
    console.error("getWatchlistSymbolsByEmail error:", err);
    return [];
  }
};
