"use client";
import { useEffect, useRef } from "react";

const useTradingViewWidget = (
  scriptUrl: string,
  config: Record<string, unknown>,
  height = 600
) => {
  const containerRef = useRef<HTMLDivElement | null>(null); // Reference to the container div that will hold the TradingView widget

  useEffect(() => {
    if (!containerRef.current) return; // Exit early if the container isn't mounted yet
    if (containerRef.current.dataset.loaded) return; // Prevent multiple script injections (only load once)

    // Create an inner div where the TradingView widget will be rendered
    containerRef.current.innerHTML = `<div class="tradingview-widget-container__widget" style="width: 100%; height: ${height}px;"></div>`;

    const script = document.createElement("script"); // Dynamically create the TradingView script
    script.src = scriptUrl;
    script.async = true;
    script.innerHTML = JSON.stringify(config);

    containerRef.current.appendChild(script);
    containerRef.current.dataset.loaded = "true"; // Mark the container as "loaded" to prevent duplicate initialization

    // Cleanup function: runs when the component unmounts or dependencies change
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
        delete containerRef.current.dataset.loaded;
      }
    };
  }, [scriptUrl, config, height]); // Re-run effect if script/config/height changes

  return containerRef;
};
export default useTradingViewWidget;
