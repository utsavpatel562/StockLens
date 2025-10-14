"use server";

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