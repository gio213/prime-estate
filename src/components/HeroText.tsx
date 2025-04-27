"use client";

import { Button } from "./ui/button";

const HeroText = () => {
  return (
    <div className="flex flex-col gap-5 items-center justify-center h-48 bg-gradient-to-b ">
      <Button className="mb-4 bg-accent rounded-2xl" variant={"link"}>
        Real Estate
      </Button>
      <div className="w-1/2 text-center ">
        {" "}
        <h1 className="text-5xl font-bold mb-4">
          Find the home that fits your life{" "}
        </h1>
        <h1 className="text-primary text-5xl font-bold mb-4 mt-10">
          perfectly
        </h1>
      </div>
    </div>
  );
};

export default HeroText;
