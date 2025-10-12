import 'dotenv/config';
import mongoose from 'mongoose';

/**
 * Main function to establish a one-time connection to MongoDB.
 * - Validates the MongoDB URI.
 * - Measures connection time.
 * - Logs connection details.
 * - Closes the connection gracefully after testing.
 */
async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('ERROR: MONGODB_URI must be set in .env');
    process.exit(1);
  }

  try {
    // Record the start time for performance measurement
    const startedAt = Date.now();

    // Attempt to connect to MongoDB
    // bufferCommands: false prevents Mongoose from queuing operations before the connection is established
    await mongoose.connect(uri, { bufferCommands: false });
    const elapsed = Date.now() - startedAt;

    // Retrieve the connected database name and host information (fallback to "(unknown)" if unavailable)
    const dbName = mongoose.connection?.name || '(unknown)';
    const host = mongoose.connection?.host || '(unknown)';

    console.log(`OK: Connected to MongoDB [db="${dbName}", host="${host}", time=${elapsed}ms]`);
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('ERROR: Database connection failed');
    console.error(err);
    try { await mongoose.connection.close(); } catch {}
    process.exit(1);
  }
}

main();