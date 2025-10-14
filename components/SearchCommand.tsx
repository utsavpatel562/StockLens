"use client";

import { useEffect, useState } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Loader2, TrendingUp } from "lucide-react";
import Link from "next/link";
import { searchStocks } from "@/lib/actions/finnhub.actions";
import { useDebounce } from "@/hooks/useDebounce";

interface SearchCommandProps {
  renderAs?: "button" | "text";
  label?: string;
  initialStocks: StockWithWatchlistStatus[];
  onOpenChange?: (open: boolean) => void; // allows parent to know open state
}

export default function SearchCommand({
  renderAs = "button",
  label = "Add stock",
  initialStocks,
  onOpenChange,
}: SearchCommandProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [stocks, setStocks] =
    useState<StockWithWatchlistStatus[]>(initialStocks);

  const isSearchMode = !!searchTerm.trim();
  const displayStocks = isSearchMode ? stocks : stocks?.slice(0, 10);

  // Keyboard shortcut handler (Cmd+K / Ctrl+K)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => {
          const newValue = !v;
          onOpenChange?.(newValue);
          return newValue;
        });
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []); // fixed — stable dependency array (no error)

  // Debounced search
  const handleSearch = async () => {
    if (!isSearchMode) return setStocks(initialStocks);
    setLoading(true);
    try {
      const results = await searchStocks(searchTerm.trim());
      setStocks(results);
    } catch {
      setStocks([]);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useDebounce(handleSearch, 300);

  useEffect(() => {
    debouncedSearch();
  }, [searchTerm]);

  // Select stock closes dialog
  const handleSelectStock = () => {
    setOpen(false);
    onOpenChange?.(false);
    setSearchTerm("");
    setStocks(initialStocks);
  };

  const handleDialogChange = (value: boolean) => {
    setOpen(value);
    onOpenChange?.(value);
  };

  return (
    <>
      {renderAs === "text" ? (
        <span
          onClick={() => handleDialogChange(true)}
          className="search-text cursor-pointer"
        >
          {label}
        </span>
      ) : (
        <Button onClick={() => handleDialogChange(true)} className="search-btn">
          {label}
        </Button>
      )}

      <CommandDialog
        open={open}
        onOpenChange={handleDialogChange}
        className="search-dialog z-[60]"
      >
        <div className="search-field">
          <CommandInput
            value={searchTerm}
            onValueChange={setSearchTerm}
            placeholder="Search stocks..."
            className="search-input"
          />
          {loading && <Loader2 className="search-loader animate-spin" />}
        </div>

        <CommandList className="search-list">
          {loading ? (
            <CommandEmpty className="search-list-empty">
              Loading stocks...
            </CommandEmpty>
          ) : displayStocks?.length === 0 ? (
            <div className="search-list-indicator">
              {isSearchMode ? "No results found" : "No stocks available"}
            </div>
          ) : (
            <ul>
              <div className="search-count">
                {isSearchMode ? "Search results" : "Popular stocks"} (
                {displayStocks?.length || 0})
              </div>
              {displayStocks?.map((stock) => (
                <li key={stock.symbol} className="search-item">
                  <Link
                    href={`/stocks/${stock.symbol}`}
                    onClick={handleSelectStock}
                    className="search-item-link flex items-center gap-2 p-2 hover:bg-neutral-800 rounded-md"
                  >
                    <TrendingUp className="h-4 w-4 text-gray-500" />
                    <div className="flex-1">
                      <div className="font-medium text-gray-50">
                        {stock.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {stock.symbol} | {stock.exchange} | {stock.type}
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
