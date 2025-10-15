import React from "react";
import { auth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";
import WatchlistTable from "./WatchlistTable";
import { getWatchlistSymbolsByEmail } from "@/lib/actions/watchlist.actions";

export default async function WatchlistPage() {
  // We can still grab the user for server-side data fetching
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;
  if (!user) return null;

  const watchlist = await getWatchlistSymbolsByEmail(user.id);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4 text-gray-200">
        My Watchlist
      </h1>
      <WatchlistTable watchlist={watchlist} />
    </div>
  );
}
