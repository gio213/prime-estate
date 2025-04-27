import React from "react";
import { ModeToggle } from "./ToggleTheme";
import NavBar from "./NavBar";
import SplitText from "./BlurText";
import MobileNav from "./MobileNav";

const Header = () => {
  return (
    <header className=" top-0 left-0 right-0 flex sticky items-center justify-between p-4 h-24 shadow-xl bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
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
      <ModeToggle />
      <MobileNav />
    </header>
  );
};

export default Header;
