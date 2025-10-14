"use client";

import { NAV_ITEMS } from "@/lib/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SearchCommand from "@/components/SearchCommand";
import { useState } from "react";
import { createPortal } from "react-dom";

const NavItems = ({
  initialStocks,
}: {
  initialStocks: StockWithWatchlistStatus[];
}) => {
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const isActive = (path: string) =>
    path === "/" ? pathname === "/" : pathname.startsWith(path);

  return (
    <>
      {/* ✅ Blur overlay BELOW the dialog */}
      {isSearchOpen &&
        typeof window !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-[40] backdrop-blur-sm bg-black/30 transition-all duration-300" />,
          document.body
        )}

      <ul className="relative z-[50] flex flex-col sm:flex-row p-2 gap-3 sm:gap-10 font-medium">
        {NAV_ITEMS.map(({ href, label }) => {
          if (href === "/search")
            return (
              <li key="search-trigger">
                <SearchCommand
                  renderAs="text"
                  label="Search"
                  initialStocks={initialStocks}
                  onOpenChange={setIsSearchOpen}
                />
              </li>
            );

          return (
            <li key={href}>
              <Link
                href={href}
                className={`hover:text-gray-100 transition-colors p-2 md:px-3 rounded-full ${
                  isActive(href) ? "text-gray-100 bg-neutral-800" : ""
                }`}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default NavItems;
