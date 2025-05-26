import React from "react";
import { ModeToggle } from "./ToggleTheme";
import NavBar from "./NavBar";
import MobileNav from "./MobileNav";
import SignInButton from "./SignInButton";
import { currentUser } from "@clerk/nextjs/server";
import { syncUser } from "@/actions/user.action";
import UserProfile from "./UserProfile";

const Header = async () => {
  const user = await currentUser();

  await syncUser();

  return (
    <header className="flex sticky top-0 z-50 items-center justify-between p-4 h-24 shadow-xl bg-background">
      <h1 className="text-2xl font-bold text-primary">Prime Estate</h1>

      <NavBar />
      <div className="flex items-center gap-4">
        {" "}
        {user ? (
          <>
            <UserProfile />
            <ModeToggle />
          </>
        ) : (
          <>
            <SignInButton />
            <ModeToggle />
          </>
        )}
      </div>
      <MobileNav />
    </header>
  );
};

export default Header;
