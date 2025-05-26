"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const refillCredit = async (
  amount: number,
  productId: string,
  userId: string
) => {
  try {
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        credit: {
          increment: amount,
        },
      },
    });

    revalidatePath("/my-profile/manage-credits");
    revalidatePath("/my-profile/manage-credits/buy-credit");
    revalidatePath(`/my-profile/manage-credits/buy-credit/${productId}`);

    return {
      message: "You have successfully refilled your credits",
      success: true,
    };
  } catch (error) {
    console.error(error);
    return {
      message: "Failed to refill credits",
      success: false,
    };
  }
};
