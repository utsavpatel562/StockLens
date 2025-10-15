import Image from "next/image";
import Link from "next/link";
import React from "react";
import NavItems from "./NavItems";
import UserDropdown from "./UserDropdown";
import { searchStocks } from "@/lib/actions/finnhub.actions";

const Header = async ({ user }: { user: User }) => {
  const initialStocks = await searchStocks();
  return (
    <>
      <header className="sticky top-0 header bg-white/4 backdrop-blur-xl border shadow-lg">
        <div className="container header-wrapper">
          <Link href={"/"} className="">
            <Image
              src={"/logo.png"}
              alt="StockLens logo"
              width={140}
              height={140}
              className="h-8 w-auto cursor-pointer"
            />
          </Link>
          <nav className="hidden sm:block">
            <NavItems initialStocks={initialStocks} />
          </nav>
          <UserDropdown user={user} initialStocks={initialStocks} />
        </div>
      </header>
    </>
  );
};

export default Header;
