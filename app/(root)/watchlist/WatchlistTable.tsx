"use client";

import React from "react";

interface WatchlistTableProps {
  watchlist: { _id: string; symbol: string; company: string }[];
}

const WatchlistTable: React.FC<WatchlistTableProps> = ({ watchlist }) => {
  if (!watchlist || watchlist.length === 0) {
    return <p className="text-gray-400">Your watchlist is empty.</p>;
  }

  return (
    <table className="w-full text-left border border-gray-700 rounded-lg">
      <thead className="bg-gray-800 text-gray-300">
        <tr>
          <th className="p-3">Symbol</th>
          <th className="p-3">Company</th>
          <th className="p-3">Actions</th>
        </tr>
      </thead>
      <tbody>
        {watchlist.map((item) => (
          <tr
            key={item._id}
            className="border-t border-gray-700 hover:bg-gray-800"
          >
            <td className="p-3 font-semibold">{item.symbol}</td>
            <td className="p-3">{item.company}</td>
            <td className="p-3">
              {/* Later we’ll integrate your <WatchlistButton /> here */}
              <button className="text-purple-400 hover:text-purple-300">
                Remove
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default WatchlistTable;
