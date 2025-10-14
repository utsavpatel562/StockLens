import Image from "next/image";
import Link from "next/link";
import React from "react";
import NavItems from "./NavItems";
import UserDropdown from "./UserDropdown";

const Header = ({ user }: { user: User }) => {
  return (
    <>
      <header className="sticky top-0 header bg-white/4 backdrop-blur-xl border shadow-lg">
        <div className="container header-wrapper">
          <Link href={"/"} className="flex items-center gap-2">
            <Image
              src={"/logo.png"}
              alt="StockLens logo"
              width={140}
              height={140}
              className="h-8 w-auto cursor-pointer"
            />
          </Link>
          <nav className="hidden sm:block">
            <NavItems />
          </nav>
          <UserDropdown user={user} />
        </div>
      </header>
    </>
  );
};

export default Header;
