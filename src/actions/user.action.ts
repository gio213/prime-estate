"use server";

import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export const syncUser = async () => {
  try {
    const user = await currentUser();
    if (!user) {
      {
        return null;
      }
    }

    const dbUser = await prisma.user.findUnique({
      where: {
        clerkId: user.id,
      },
    });
    if (!dbUser) {
      await prisma.user.create({
        data: {
          clerkId: user.id,
          email: user.emailAddresses[0].emailAddress,
          name: user.fullName,
          sirname: user.lastName,
          username:
            (user.firstName?.charAt(0)?.toLocaleUpperCase() || "") +
            user.lastName?.charAt(0).toLocaleUpperCase(),
        },
      });
    }
    return { message: "User synced successfully" };
  } catch (error) {
    console.error(error);
    return { message: "Error syncing user" };
  }
};

export const dbUser = async () => {
  try {
    const user = await currentUser();
    if (!user) {
      {
        return null;
      }
    }

    const dbUser = await prisma.user.findUnique({
      where: {
        clerkId: user.id,
      },
    });
    return dbUser;
  } catch (error) {
    console.error(error);
  }
};
