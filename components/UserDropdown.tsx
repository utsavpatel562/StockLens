"use client";
import React from "react";
import { HiOutlineLogout } from "react-icons/hi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import NavItems from "./NavItems";
const UserDropdown = () => {
  const router = useRouter();
  const handleSignOut = async () => {
    router.push("/sign-in");
  };
  const user = { name: "Utsav", email: "utsav@gmail.com" };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="flex items-center gap-3 text-gray-400 hover:text-indigo-300"
          variant={"ghost"}
        >
          <Avatar className="h-8 w-8 cursor-pointer">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback className="bg-indigo-300 text-indigo-950 text-sm font-bold">
              {user.name[0]}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:flex flex-col items-start">
            <span className="text-base font-medium text-gray-400">
              {user.name}
            </span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="text-gray-400">
        <DropdownMenuLabel>
          <div className="flex relative items-center gap-3 py-2">
            <Avatar className="h-10 w-10">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback className="bg-indigo-300 text-indigo-950 text-sm font-bold">
                {user.name[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-base font-medium text-gray-400">
                {user.name}
              </span>
              <span className="text-sm text-gray-500">{user.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-500" />
        <DropdownMenuItem
          onClick={handleSignOut}
          className="cursor-pointer text-md text-gray-100 font-medium focus:bg-transparent transition-colors"
        >
          <LogOut className="h-6 w-6 mr-2 hidden sm:block" />
          Logout
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <nav className="sm:hidden">
          <NavItems />
        </nav>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
