"use client";
import { UserButton } from "@clerk/nextjs";
import { Coins, User } from "lucide-react";
import React, { useEffect, useState } from "react";
import { dbUser } from "@/actions/user.action";

const UserProfile = () => {
  const [userCredit, setUserCredit] = useState<number>(0) || null;

  useEffect(() => {
    const getUserCredit = async () => {
      const userData = await dbUser();
      if (userData?.credit) {
        setUserCredit(userData.credit);
      }
    };
    getUserCredit();
  }, []);

  return (
    <>
      <UserButton
        showName
        userProfileMode="modal"
        appearance={{
          variables: {
            colorText: "#da2a2a",
          },
        }}
      >
        <UserButton.MenuItems>
          <UserButton.Link
            href="/my-profile"
            label="My Profile"
            labelIcon={<User size={15} />}
          />
        </UserButton.MenuItems>
      </UserButton>
      <div className="flex items-center gap-2">
        <Coins size={20} className="text-amber-500" />
        <span className="text-amber-500">{`(${userCredit})`}</span>
      </div>
    </>
  );
};

export default UserProfile;
