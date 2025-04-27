import React from "react";
import { navbarItems } from "@/constants/constats";
import Link from "next/link";
import { Button } from "./ui/button";

const NavBar = () => {
  return (
    <div className="hidden md:flex space-x-4">
      {navbarItems.map((item, index) => (
        <Button asChild key={index} variant={"ghost"} size="sm">
          <Link
            href={item.href}
            className="text-gray-700 hover:rounded-2xl flex gap-2 items-center dark:text-primary hover:text-primary dark:hover:text-primary   transition-all duration-300 ease-in-out p-5 font-bold underline-offset-8  "
          >
            {item.name}
            {item.icon && (
              <span className="text-gray-700 dark:text-gray-100">
                {item.icon}
              </span>
            )}
          </Link>
        </Button>
      ))}
    </div>
  );
};

export default NavBar;
