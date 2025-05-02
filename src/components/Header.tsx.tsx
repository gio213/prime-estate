import React from "react";
import { ModeToggle } from "./ToggleTheme";
import NavBar from "./NavBar";
import SplitText from "./BlurText";
import MobileNav from "./MobileNav";
import SignInButton from "./SignInButton";
import { currentUser } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import { syncUser } from "@/actions/user.action";
import { User } from "lucide-react";
import UserProfile from "./UserProfile";

const Header = async () => {
  const user = await currentUser();
  await syncUser();

  return (
    <header className="flex sticky top-0 z-50 items-center justify-between p-4 h-24 shadow-xl bg-background">
      <SplitText
        animateBy="letters"
        text=" Prime Estate!"
        className="text-4xl font-extrabold text-center text-primary mask-b-from-accent-foreground font-mono"
        delay={150}
        animationFrom={{ opacity: 0, transform: "translate3d(0,50px,0)" }}
        threshold={0.2}
        rootMargin="-50px"
      />

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
