"use client";
import { NAV_ITEMS } from "@/lib/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const NavItems = () => {
  const pathname = usePathname();
  const isActive = (path: string): boolean => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  return (
    <ul className="flex flex-col sm:flex-row gap-3 sm:gap-10">
      {NAV_ITEMS.map(({ href, label }) => (
        <li
          key={href}
          className="hover:bg-neutral-800 p-2 text-gray-200 rounded-full md:w-[100px] text-center"
        >
          <Link
            href={href}
            className={`transition-colors ${
              isActive(href) ? "hover:text-gray-50" : ""
            }`}
          >
            {label}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default NavItems;
