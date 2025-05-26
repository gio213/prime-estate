import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "./ui/button";

interface AuthFormModalProps {
  mode: "signIn" | "signUp";
  children: React.ReactNode;
}

const AuthFormModal = ({ mode, children }: AuthFormModalProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        {mode === "signIn" ? (
          <Button variant={"outline"} className="hover:cursor-pointer">
            User Login
          </Button>
        ) : (
          <Button className="hover:cursor-pointer">User Registration</Button>
        )}
      </SheetTrigger>
      <SheetContent side={mode === "signIn" ? "right" : "top"}>
        <SheetHeader>
          <SheetTitle>
            {mode === "signIn" ? "User Login" : "User Registration"}
          </SheetTitle>
          <SheetDescription>
            {mode === "signIn"
              ? "Welcome back! Please enter your credentials."
              : "Create a new account."}
          </SheetDescription>
          {children}
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default AuthFormModal;
