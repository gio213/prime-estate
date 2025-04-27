import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { navbarItems } from "@/constants/constats";

const MobileNav = () => {
  return (
    <Sheet>
      <SheetTrigger className="blocl md:hidden">
        <Menu size={25} />
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
          <SheetDescription>
            This is a description of the menu.
          </SheetDescription>
        </SheetHeader>
        {/* Add your menu items here */}
        <div className="flex flex-col gap-4">
          {navbarItems.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-center font-bold gap-2"
            >
              <span>{item.name}</span>
              {item.icon && (
                <span className="text-gray-700 dark:text-gray-100">
                  {item.icon}
                </span>
              )}
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
