import Image from "next/image";
import Link from "next/link";
import React from "react";
import NavItems from "./NavItems";

const Header = () => {
  return (
    <>
      <header className="sticky top-0 header">
        <div className="container header-wrapper">
          <Link href={"/"} className="flex items-center gap-2">
            <Image
              src={"/logo.png"}
              alt="StockLens logo"
              width={140}
              height={140}
              className="h-8 w-auto cursor-pointer"
            />
            <h2 className="text-slate-50 text-2xl font-medium">StockLens</h2>
          </Link>
          <nav className="hidden sm:block">
            <NavItems />
          </nav>
          {/*User DropDown*/}
        </div>
      </header>
    </>
  );
};

export default Header;
