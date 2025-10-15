"use client";

import React, { useState, useTransition } from "react";
import WatchlistButton from "@/components/WatchlistButton";
import {
  addToWatchlist,
  getUserWatchlist,
  removeFromWatchlist,
} from "@/lib/actions/watchlist.actions";

type WatchlistClientProps = {
  user: { id: string; email: string; name?: string } | null;
  symbol: string;
  company: string;
};

export default function WatchlistClient({
  user,
  symbol,
  company,
}: WatchlistClientProps) {
  const [isPending, startTransition] = useTransition();
  const [added, setAdded] = useState<boolean>(false);

  // Check if already in watchlist (optional improvement)
  React.useEffect(() => {
    if (!user) return;
    (async () => {
      const list = await getUserWatchlist(user.id);
      const exists = list.some((item: any) => item.symbol === symbol);
      setAdded(exists);
    })();
  }, [user, symbol]);

  const handleWatchlistChange = async (_symbol: string, isAdded: boolean) => {
    if (!user) return alert("Please sign in to manage your watchlist.");

    startTransition(async () => {
      if (isAdded) {
        const result = await addToWatchlist(user.id, _symbol, company);
        if (result.success) setAdded(true);
      } else {
        const result = await removeFromWatchlist(user.id, _symbol);
        if (result.success) setAdded(false);
      }
    });
  };

  return (
    <WatchlistButton
      symbol={symbol}
      company={company}
      isInWatchlist={added}
      onWatchlistChange={handleWatchlistChange}
    />
  );
}
