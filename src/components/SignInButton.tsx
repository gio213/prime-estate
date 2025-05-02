import { SignInButton as SignInButtonClerk, UserButton } from "@clerk/nextjs";
import React from "react";
import { Button } from "./ui/button";
import { User } from "lucide-react";
import { auth } from "@clerk/nextjs/server";

const SignInButton = () => {
  return (
    <div className="flex items-center gap-2">
      <User className="text-gray-700 dark:text-primary" />
      <Button asChild variant={"ghost"} size="default">
        <SignInButtonClerk mode="modal" />
      </Button>
    </div>
  );
};

export default SignInButton;
